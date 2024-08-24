import axios from 'axios';
import { useAuthStore } from '@stores/auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', 
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    if (authStore.token) {
      config.headers['Authorization'] = `Bearer ${authStore.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const authStore = useAuthStore();

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({resolve, reject});
        }).then(() => {
          return axiosInstance(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await axiosInstance.post('/api/auth/refresh');
        
        if (response.status === 200) {
          authStore.setToken(response.data.token);
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
          processQueue(null, response.data.token);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.clearAuth();
        router.push('/login');
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
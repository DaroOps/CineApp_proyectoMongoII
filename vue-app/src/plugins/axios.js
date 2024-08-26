import axios from 'axios';
import { useAuthStore } from '@stores/auth.js';

console.log('ENV:', import.meta.env.VITE_ENV);
console.log('BACKEND_URL:', import.meta.env.VITE_BACKEND_URL);

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_ENV === 'production' ?  import.meta.env.VITE_BACKEND_URL : 'http://localhost:3000',
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
          processQueue(null, response.data.token);
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
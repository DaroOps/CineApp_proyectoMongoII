import axiosInstance from "@plugins/axios.js";
import { defineStore } from 'pinia';


export const useAuthStore = defineStore('auth', {
    state: () => ({
      isLoggedIn: false,
      user: null,
    }),
    actions: {
      async login(email, password) {
        try {
          await axiosInstance.post('/api/auth/login', { email, password });
          this.isLoggedIn = true;
          await this.verifyLogin();
          await this.fetchUser();
          console.log('Logged in successfully');
        } catch (error) {
          console.error('Login failed', error);
          throw error;
        }
      },
      async logout() {
        try {
          await axios.post('/api/auth/logout');
          this.clearAuth();
        } catch (error) {
          console.error('Logout failed', error);
        }
      },
      clearAuth() {
        this.isLoggedIn = false;
        this.user = null;
      },
      async verifyLogin() {
        try {
            const { data } = await axiosInstance.post('/api/auth/verify');
            console.log('data.isLoggedIn', data);
            this.user = data;
        } catch (error) {
          console.error('Failed to verify login', error);
        }
      },
      async fetchUser() {
        try {
          const { data }  = await axiosInstance.get(`/api/users/${this.user.id}`);
          this.user = data;
        
          
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      },
      async checkAuth(){
        try {
            const response = await axiosInstance.post('/api/auth/verify');
            this.isAuthenticated = true;
            this.user = response.data.user;
          } catch (error) {
            if (error.response && error.response.status === 401) {
              await this.refreshToken();
            } else {
              this.isAuthenticated = false;
              this.user = null;
            }
          }
      },
      async refreshToken(){
        try {
            const response = await axiosInstance.post('/api/auth/refresh');
            this.isAuthenticated = true;
            this.user = response.data.user;
          } catch (error) {
            this.isAuthenticated = false;
            this.user = null;
          }
      },
    },
  });
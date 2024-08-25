import axiosInstance from "@plugins/axios.js";
import { defineStore } from 'pinia';
import Login from "../pages/Login/Login.vue";

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false,
    user: null,
  }),
  actions: {
    setAuthenticated(status) {
      this.isLoggedIn = status;
    },

    setUser(user) {
      this.user = user;
    },

    clearAuth() {
      this.isLoggedIn = false;
      this.user = null;
    },

    async login(email, password) {
      try {
        await axiosInstance.post('/api/auth/login', { email, password });
        await this.checkAuth();
        await this.fetchUser();
        console.log('Logged in successfully');
      } catch (error) {
        console.error('Login failed', error);
        throw error;
      }
    },

    async checkAuth() {
      try {
        const {data} = await axiosInstance.post('/api/auth/verify');
        !this.user?
        this.setUser(data)
        : 
        !this.user.profileImage?
        this.fetchUser()
        :
        '';
        this.setAuthenticated(true);
        return true;
      } catch (error) {
        console.error('Failed to verify authentication', error);
        this.clearAuth();
        return false;
      }
    },

    async fetchUser() {
      try {
        const { data } = await axiosInstance.get(`/api/users/${this.user.id}`);
        console.log(data);
        this.user = data;
        console.log("called fetch me", this.user);
        
      } catch (error) {
        console.error('Failed to fetch user', error);
      }
    },

    async logout() {
      try {
        await axiosInstance.post('/api/auth/logout');
        this.clearAuth();
      } catch (error) {
        console.error('Logout failed', error);
      }
    },

    async updateUser(data) {
      try {
        // console.log('Received data for update:', data);
    
        const formData = new FormData();
    
        for (const [key, value] of Object.entries(data)) {
          if (value instanceof File || value instanceof Blob) {
            formData.append(key, value);
          } else if (value !== null && value !== undefined && value !== '') {
            formData.append(key, String(value));
          }
        }
    
        // form data
        // for (let [key, value] of formData.entries()) {
        //   console.log(`${key}: ${value}`);
        // }
    
        if (formData.entries().next().done) {
          console.log('No data to update');
          return;
        }
    
        const response = await axiosInstance.put(`/api/users/${this.user.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
    
        console.log('User updated successfully', response.data);
        await this.fetchUser();
      } catch (error) {
        console.error('Failed to update user', error);
      }
    }
  },
});
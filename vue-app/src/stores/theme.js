import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDarkTheme: true
  }),
  getters: {
    currentTheme: (state) => state.isDarkTheme ? 'dark' : 'light'
  },
  actions: {
    setLightMode() {
      this.isDarkTheme = false
    },
    setDarkMode() {
      this.isDarkTheme = true
    },
    toggleTheme() {
      this.isDarkTheme = !this.isDarkTheme
    }
  }
})
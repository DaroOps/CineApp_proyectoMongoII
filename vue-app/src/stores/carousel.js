import { defineStore } from 'pinia'
import axios from 'axios';

export const useCarouselStore = defineStore('carousel', {
  state: () => ({
    movies: [],
    currentIndex: 0
  }),
  actions: {
    nextImage() {
      this.currentIndex = (this.currentIndex + 1) % this.movies.length
    },
    prevImage() {
      this.currentIndex = (this.currentIndex - 1 + this.movies.length) % this.movies.length
    },
    async fetchMovies() {
      const {data} = await axios.get(`http://localhost:3000/api/movies`)
      this.movies = data;
    }
  },
  getters: {
    moviesArray: (state) => state.movies,
    currentImageIndex: (state) => state.currentIndex
  }
})
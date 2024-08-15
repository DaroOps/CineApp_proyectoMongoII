import { defineStore } from 'pinia'
import axios from 'axios';

export const useMovieStore = defineStore('movies', {
  state: () => ({
    movies: [],
    selectedMovie: {
      title: '',
      genre: '',
      image_url: '',
      _id: ''
    },
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
    },
    async fetchMovieDetails(movieId) {
      const {data} = await axios.get(`http://localhost:3000/api/movies/${movieId}`)
      this.selectedMovie = data;
    },
    setSelectedMovie(movie) {
      this.selectedMovie = movie ? { ...movie } : null;
    },
    clearSelectedMovie() {  
      this.selectedMovie = {};
    }
  },
  getters: {
    moviesArray: (state) => state.movies,
    currentImageIndex: (state) => state.currentIndex,
  },
})
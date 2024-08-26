import { defineStore } from 'pinia'
import axios from 'axios';
import axiosInstance from "@plugins/axios.js";


export const useMovieStore = defineStore('movies', {
  state: () => ({
    movies: [],
    comingSoonMovies: [],
    selectedMovie: {
      title: '',
      genre: '',
      img: '',
      id: '',
      trailer: ''
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
    async fetchComingSoonMovies() {
      const {data} = await axiosInstance.get(`/api/movies/v1/coming-soon?limit=3`);
      this.comingSoonMovies = data.movies;
    },
    async fetchMovies() {
      const {data} = await axiosInstance.get(`/api/movies`)
      this.movies = data;
    },
    async fetchMovieDetails(movieId) {
      const {data} = await axiosInstance.get(`/api/movies/${movieId}`)
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
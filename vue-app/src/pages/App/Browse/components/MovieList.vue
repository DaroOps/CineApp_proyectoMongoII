<template>
    <div v-if="movies.length" class="movie-list">
      <h2>Movies</h2>
      <ul>
        <li class="movie-item" v-for="movie in movies" :key="movie.id">
          <img :src="movie.img" :alt="movie.title" />
          <div>
            <h3>{{ movie.title }}</h3>
            <p>{{ movie.genre }}</p>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    movies: {
      type: Array,
      required: true
    }
  });
  </script>

  <style lang="scss" scoped>
  .movie-list {
  

    ul{
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  }
  
  .movie-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--background-color2);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  
    img {
      width: 100px;
      height: 150px;
      object-fit: cover;
      border-radius: 5px;
    }
  
    div {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
    }
  
    p {
      font-size: 14px;
      color: var(--color-text-2);
    }
  }
  </style>
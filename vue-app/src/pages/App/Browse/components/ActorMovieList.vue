<template>
    <div v-if="actorMovies.length" class="actor-movie-list">
      <h2>Movies of actors</h2>
      <div class="actor-movie-item" v-for="item in actorMovies" :key="item.actor.id">
        <h3>{{ item.actor.name }}</h3>
        <ul>
          <li v-for="movie in item.movies" :key="movie.id">
            <img :src="movie.img" :alt="movie.title" />
            <div>
              <h4>{{ movie.title }}</h4>
              <p>{{ movie.genre }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    actorMovies: {
      type: Array,
      required: true
    }
  });
  </script>

  <style lang="scss" scoped>
  .actor-movie-list {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .actor-movie-item {
    display: flex;
    flex-direction: column;
    gap: 0px;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--background-color2);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
      margin-bottom: 5px;
    }
  
    ul {
      padding: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
  
    li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px;
      border-radius: 10px;
      background-color: var(--background-linear);
      outline: 1px solid rgb( from var(--text-color) r g b /20%);
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  
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
  
    h4 {
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
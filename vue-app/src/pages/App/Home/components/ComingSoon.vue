<template>
    <div class="movie-card">
      <div class="poster-container">
        <img src="https://image.tmdb.org/t/p/w500/r7vmZjiyZw9rpJMQJdXpjgiCOk9.jpg" alt="Movie poster collage" class="poster">
      </div>
      <div class="info-container">
        <h2 class="title">Furious 10 (2023)</h2>
        <p class="genre">Action, Adventure</p>
      </div>
    </div>
  </template>
  
  <script setup>
  // No reactive data or methods needed for this static component
  </script>
  
  <style scoped>
  .movie-card {
    display: flex;
    gap: 18px;
    border-radius: 20px;
    background-color: var(--background-color2);
    overflow: hidden;
   
  }
  
  .poster-container {
    height: 80px;
    width: 80px;
    margin: 9px 0px 9px 10px;
    overflow: hidden;
    border-radius: 20px;
  }
  
  .poster {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  
  .title {
    color: var(--text-color);
    font-size: 16px;
    margin: 0 0 2px 0;
  }
  
  .genre {
    color: var(--text-color);
    font-size: 14px;
    margin: 0;
  }
  </style>
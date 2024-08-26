<script setup>
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
    const router = useRouter();

    const props = defineProps({
        movie: {
            type: Object,
            required: true,
            default: {
                title: '',
                genre: '',
                image_url: ''
            }
        }
    });

    const onCardClick = (movieId) => {
            
            router.push(`/app/c-s${movieId}`);
        };

</script>

<template>
    <div class="movie-card" @click="onCardClick(movie.id)">
      <div class="poster-container">
        <img :src="movie.img" alt="Movie poster collage" class="poster">
      </div>
      <div class="info-container">
        <h2 class="title">{{ movie.title }}</h2>
        <p class="genre">{{ movie.genre }}</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  .movie-card {
    display: flex;
    gap: 18px;
    border-radius: 20px;
    background-color: var(--background-color2);
    overflow: hidden;
   
  }

  .movie-card:hover{
    cursor: pointer;
  }
  
  .poster-container {
    height: 80px;
    width: 80px;
    margin: 9px 0px 9px 10px;
    overflow: hidden;
    border-radius: 20px;
  }

  .info-container{
    padding: 19px 0 0 0;
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
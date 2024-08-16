<script setup>
  import CinemaHeader from '@components/CinemaHeader/CinemaHeader.vue';
  import PreviewMovie from './components/PrevieMovie/PreviewMovie.vue';
  import { useMovieStore } from '@stores/movies.js';
  import CastSlider from './components/CastSlider.vue';

  const store = useMovieStore();

  function backButtonClicked() {
    store.clearSelectedMovie();
  }

</script>

<template>
  <div class='cinema-selection-page'>
    <CinemaHeader headerText="Cinema Selection" :onBackClick="backButtonClicked" />
    <div class="movie-info-container">
      <PreviewMovie />
    </div>

    <div class="cast-slider">
      <CastSlider :cast="store.selectedMovie?.cast" />
    </div>
  </div>
</template>

<style scoped>
.cinema-selection-page {
 
  height: 100vh;
}
</style>
<script setup>
  import CinemaHeader from '@components/CinemaHeader/CinemaHeader.vue';
  import PreviewTrailer from './components/PreviewTrailer.vue';
  import { useMovieStore } from '@stores/movies.js';

  const store = useMovieStore();

  function backButtonClicked() {
    store.clearSelectedMovie();
  }

</script>

<template>
  <div class='cinema-selection-page'>
    <CinemaHeader headerText="Cinema Selection" :onBackClick="backButtonClicked" />
    <PreviewTrailer />
  </div>
</template>

<style scoped>
.cinema-selection-page {
 
  height: 100vh;
}
</style>
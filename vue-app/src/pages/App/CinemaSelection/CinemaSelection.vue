<script setup>
  import CinemaHeader from '@components/CinemaHeader/CinemaHeader.vue';
  import PreviewMovie from './components/PrevieMovie/PreviewMovie.vue';
  import { useMovieStore } from '@stores/movies.js';
  import { useScreeningStore } from '@stores/screenings.js';
  import CastSlider from './components/CastSlider.vue';
  import CinemaCard from './components/CinemaCard.vue';
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';

  const store = useMovieStore();
  const screeningStore = useScreeningStore();
  const router = useRouter();
  const selectedCard = ref(null);

  function backButtonClicked() {
    store.clearSelectedMovie();
    router.back();
  }

  function selectCinema(id) {
    id != selectedCard.value? selectedCard.value = id : selectedCard.value = null;
  }
  
  function bookNowClicked() {
    screeningStore.getScreeningsForCinema(store.selectedMovie.id, selectedCard.value);

    router.push(`/app/b-n${store.selectedMovie.id}-${selectedCard.value}`);
    // console.log(`Book Now clicked for ${selectedCard.value}`, router.currentRoute);
  }

</script>

<template>
  <CinemaHeader headerText="Cinema Selection" :onBackClick="backButtonClicked" />
  <div class='cinema-selection-page'>
    <div class="movie-info-container">
      <PreviewMovie />
    </div>

    <div class="cast-slider">
      <CastSlider :cast="store.selectedMovie?.cast" />
    </div>

    <div class="dispatcher-info">
      <h2 class="cinema-selection-title">Cinema</h2>
      <div class="cinema-selection-cards">
        <CinemaCard v-for="cinema in store.selectedMovie.cinemas" 
        :key="cinema.id"
        :logoSrc="cinema.img" 
        :name="cinema.name" 
        :location="cinema.location" 
        :isSelected="selectedCard === cinema.id"
         @select="selectCinema(cinema.id)"
        />
      </div>
      
      <div class="book-now-container">
        <button class="book-now-button" @click="bookNowClicked" :disabled="!selectedCard">
          <span>Book Now</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.cinema-selection-page {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 26px;
}

.dispatcher-info {
  padding: 0 30px 0px 30px;

  & h2 {
    font-size: 16px;
    font-weight: 600;
    color: var(--text-color);
    font-family: var(--font-inter);
    padding-bottom: 15px;
    margin: 0;
  }

  & .cinema-selection-cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 0 10px 0;
    margin-bottom: 60px;
  }
}

.book-now-container {
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: var(--background-color);
  bottom: 0;
  left: 0;
  z-index: 10;
}
.book-now-button {
  width: 100%;
  height: 48px;
  background-color: var(--primary-color);
  color: var(--text-color);
  font-size: 16px;
  font-family: var(--font-inter);
  font-weight: 700;
  border-radius: 10px;
  border: none;
  cursor: pointer; 
  transition: all 0.3s ease;
  margin: 0px 30px 10px 30px;

  &:disabled {
    background-color: var(--primary-color);
    cursor: not-allowed;
    opacity: 0.5;
    transition: all 0.3s ease;
  }

  }
</style>
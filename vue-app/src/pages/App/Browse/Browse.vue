<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import CustomInput from '@components/CustomInput/CustomInput.vue';
import { useMovieStore } from '@stores/movies.js';
import { storeToRefs } from 'pinia';
import MovieList from './components/MovieList.vue'
import ActorMovieList from './components/ActorMovieList.vue'
import ActorList from './components/ActorList.vue'
import CinemaList from './components/CinemaList.vue'
import IconBookSearch from '@icons/empty/BookSearch.vue';

const movieStore = useMovieStore()
const { searchResults } = storeToRefs(movieStore)
const isLoading = ref(false)
const error = ref(null)

const searchMovies = async (query) => {
  if (!query.trim()) return;
//   console.log("enter in the father");
  
  isLoading.value = true;
  error.value = null;
  
  try {
    console.log('called searchMovies', query);
    await movieStore.searchMovies(query);
  } catch (err) {
    error.value = 'Ha ocurrido un error en la búsqueda. Por favor, inténtelo de nuevo.';
    console.error('Error en la búsqueda:', err);
  } finally {
    isLoading.value = false;
  }
}

watch(() => searchResults.value, (newResults) => {
  if (Object.values(newResults).every(arr => arr.length === 0)) {
    error.value = 'No results found for this search.';
  }
}, { deep: true });
</script>

<template>
    <div class="browse">
      <div class="browse-container">
        <CustomInput :searchFunction="searchMovies" :isHomePage="false" />
        <p v-if="isLoading" class="loading-message">Loading Results...</p>
        <p v-else-if="error" class="error-message">{{ error }}</p>
      </div>
      <div class="browse-results">
        <div class="empty-search" v-if="searchResults?.movies?.length === 0 && searchResults?.actorMovies?.length === 0 && searchResults?.actors?.length === 0 && searchResults?.cinemas?.length === 0 || searchResults.length === 0">
          <IconBookSearch/>
          <p>The is nothing here yet</p>
        </div>
        <MovieList v-if="searchResults?.movies?.length" :movies="searchResults.movies"/>
        <ActorMovieList v-if="searchResults?.actorMovies?.length" :actorMovies="searchResults.actorMovies" :actors="searchResults.actors" />
        <ActorList v-if="searchResults?.actors?.length" :actors="searchResults.actors" />
        <CinemaList v-if="searchResults?.cinemas?.length" :cinemas="searchResults.cinemas" />
      </div>
    </div>
</template>

<style lang="scss" scoped>
.browse {
  display: flex;
  flex-direction: column;
  padding:25px 30px;

  .browse-results {
    width: 100%;
    height: 100%;
    padding: 20px 0px;
    .empty-search {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      p {
        font-size: 20px;
        margin: 0;
        font-weight: 700;
        color: var(--text-subtitle-color);
      }
    }
  }
}



.browse-header {
  width: 100%;
  height: 60px;
  
  padding: 30px 20px;
}

.browse-header-left {
  display: flex;
  align-items: center;
}

.browse-header-left-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-1);
}
</style>
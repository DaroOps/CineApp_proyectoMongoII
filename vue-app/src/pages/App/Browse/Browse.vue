<script setup>
import { onBeforeMount, ref, watch } from 'vue';
import CustomInput from '@components/CustomInput/CustomInput.vue';
import { useMovieStore } from '@stores/movies.js';
import { storeToRefs } from 'pinia';
import MovieList from './components/MovieList.vue'
import ActorMovieList from './components/ActorMovieList.vue'
import ActorList from './components/ActorList.vue'
import CinemaList from './components/CinemaList.vue'

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
    error.value = 'No se encontraron resultados para esta búsqueda.';
  }
}, { deep: true });
</script>

<template>
    <div class="browse">
      <header class="browse-header">
        <CustomInput :searchFunction="searchMovies" :isHomePage="false" />
      </header>
      <p v-if="isLoading" class="loading-message">Cargando resultados...</p>
      <p v-else-if="error" class="error-message">{{ error }}</p>
      <main class="browse-results">
        <MovieList v-if="searchResults?.movies?.length" :movies="searchResults.movies"/>
        <ActorMovieList v-if="searchResults?.actorMovies?.length" :actorMovies="searchResults.actorMovies" :actors="searchResults.actors" />
        <ActorList v-if="searchResults?.actors?.length" :actors="searchResults.actors" />
        <CinemaList v-if="searchResults?.cinemas?.length" :cinemas="searchResults.cinemas" />
      </main>
    </div>
</template>

<style lang="scss" scoped>
.browse {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.browse-results {
  width: 100%;
  padding: 20px 20px;
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
<script setup>
import SkeletonLoader from '@components/SkeletonLoader/SkeletonLoader.vue';
import { useMovieStore } from '@stores/movies.js';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute();
const movieId = route.params.id;
const store = useMovieStore();
const { selectedMovie } = storeToRefs(store);

onMounted(() => {
    store.fetchMovieDetails(movieId);
});

watch(() => route.params.id, (newId) => {
    store.fetchMovieDetails(newId);
});
</script>

<template>
    <div class='trailer-preview'>
        <img loading="lazy":src="selectedMovie.image_url" :alt="selectedMovie.title" />
    </div>
</template>

<style scoped>
.trailer-preview {
    border-radius: 10px;
    overflow: hidden;
    height: 204px;
    padding: 13px 13px 10px 13px;
}

img {
    border-radius: inherit;
    width: 100%;
    height: 150%;
    object-fit: cover;
}
</style>
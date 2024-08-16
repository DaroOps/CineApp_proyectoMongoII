<script setup>
import SkeletonLoader from '@components/SkeletonLoader/SkeletonLoader.vue';
import { useMovieStore } from '@stores/movies.js';
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import TrailerButton from './components/TrailerButton.vue';


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
        <img loading="lazy" :src="selectedMovie.img" :alt="selectedMovie.title" />
    </div>
    <div class='trailer-info'>
        <div class="header">
            <div class="tile-genre">
                <h2 class='title'>{{ selectedMovie.title }}</h2>
                <p class='genre'>{{ selectedMovie.genre }}</p>
            </div>
            <TrailerButton />
        </div>
        <p class='synopsis'>{{ selectedMovie.synopsis }}</p>
    </div>

</template>

<style lang="scss" scoped>
.trailer-preview {
    border-radius: 10px;
    overflow: hidden;
    height: 204px;
    margin: 13px 13px 10px 13px;

    & img {
        width: 100%;
        height: 150%;
        object-fit: cover;
    }
}

.trailer-info {
    border-radius: 10px;
    height: 100%;
    overflow: hidden;
    margin: 0 30px 0 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    & p {
        margin: 0;
        padding: 0;
    }

    & h2 {
        margin: 0;
        padding: 0;
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .tile-genre {
            display: flex;
            align-items: flex-start;
            flex-direction: column;

            .title {
                font-family: var(--font-inter);
                font-weight: 600;
                color: var(--text-color);
                font-size: 15px;
            }

            .genre {
                font-family: var(--font-inter);
                font-weight: 400;
                color: var(--text-color);
                font-size: 10px;
            }
        }
    }

    .synopsis {
        font-family: var(--font-inter);
        font-weight: 500;
        color: var(--text-color);
        font-size: 12px;
        text-align: left;
        vertical-align: top;
    }

}
</style>
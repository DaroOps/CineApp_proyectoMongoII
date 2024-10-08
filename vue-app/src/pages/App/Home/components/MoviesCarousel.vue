<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import {  Pagination } from 'swiper/modules';
import { useMovieStore } from '@stores/movies.js';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref } from 'vue';

import 'swiper/css';
import 'swiper/css/pagination';
import { useRouter } from 'vue-router';

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        const movieStore = useMovieStore();
        const { moviesArray, currentImageIndex } = storeToRefs(movieStore);
        const router = useRouter();
        const currentMovie = computed(() => {
        return moviesArray.value[currentImageIndex.value] || {};
        });

        onMounted(() => {
            movieStore.fetchMovies();
        });

        const onSwiper = (swiper) => {
            movieStore.currentIndex = swiper.realIndex;
        };

        const onSlideChange = (swiper) => {
            movieStore.currentIndex = swiper.realIndex;
        };

        const onSlideClick = (movieId) => {
            
            router.push(`/app/c-s${movieId}`);
        };

        return {
            modules: [Pagination],
            data: movieStore.movies,
            moviesArray,
            currentImageIndex,
            currentMovie,
            movieStore,
            onSwiper,
            onSlideChange,
            onSlideClick,
        };
    },
}
</script>

<template>
    <swiper :initialSlide="2" 
        :centeredSlides="true" 
        :slidesPerView="'auto'" 
        :spaceBetween="20" 
        :freeMode="true"
        :loop="moviesArray.length > 4"
        :pagination="{
        clickable: true,
        el: '.swiper-pagination',
        }
        ":modules="modules" class="mySwiper" 
        @swiper="onSwiper" 
        @slideChange="onSlideChange">

        <swiper-slide v-show="moviesArray.length > 4" v-for="movie in moviesArray" 
        :key="movie.id"
        :lazy="true"
        @click="onSlideClick(movie.id)" 
        >
            <img  loading="lazy" :src="movie.img" :alt="movie.title + ' poster'" />
        </swiper-slide>

        <div class="swiper-pagination" slot="pagination">
    </div>
    </swiper>
    <div class="movie-info">
        <h2 class="movie-title">{{ currentMovie.title }}</h2>
        <p class="movie-genre">{{ currentMovie.genre }}</p>
    </div>
</template>


<style lang="scss" scoped>

.swiper {
    width: 100%;
    min-height: 425px;
    position: relative;
    z-index: 0;
}

.swiper-slide {
    text-align: center;
    font-size: 18px;
    width: 204px;
    height: 319px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    cursor: pointer;
}

.swiper-slide img {
    display: block;
    width: 204px;
    height: 100%;
  
    object-fit: cover;
    border-radius: 20px;
}

:deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: var(--text-color);
  opacity: 1;
  transition: all 0.3s ease;
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--primary-color);
  width: 24px;
  border-radius: 5px;
  transition: all 0.3s ease;
}

.movie-info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    top: -65px;
    position: relative;
    height: 0;
    
    .movie-title {
        padding: 0;
        margin: 0;
        font-size: 18px;
        color: var(--text-color);
        font-family: var(--font-inter);
        text-align: center;
    }
    
    .movie-genre {
        color: rgba(var(--text-color-rgb), 0.6);
        font-weight: 700;
        font-family: var(--font-inter);
        font-size: 13px;
        padding: 0;
        margin: 0;
    }
}


</style>
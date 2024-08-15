<script>
import { Swiper, SwiperSlide } from 'swiper/vue';
import {  Pagination } from 'swiper/modules';
import { useCarouselStore } from '@stores/carousel.js';
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
        const carouselStore = useCarouselStore();
        const { moviesArray, currentImageIndex } = storeToRefs(carouselStore);
        const router = useRouter();
        const currentMovie = computed(() => {
        return moviesArray.value[currentImageIndex.value] || {};
        });

        onMounted(() => {
            carouselStore.fetchMovies();
        });

        const onSwiper = (swiper) => {
            carouselStore.currentIndex = swiper.realIndex;
        };

        const onSlideChange = (swiper) => {
            carouselStore.currentIndex = swiper.realIndex;
        };

        const onSlideClick = (movieId) => {
            router.push(`/app/cinema-select:${movieId}`);
        };

        return {
            modules: [Pagination],
            data: carouselStore.movies,
            moviesArray,
            currentImageIndex,
            currentMovie,
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
        :loop="moviesArray.length > 1"
        :pagination="{
        clickable: true,
        el: '.swiper-pagination',
        }
        ":modules="modules" class="mySwiper" 
        @swiper="onSwiper" 
        @slideChange="onSlideChange">

        <swiper-slide v-show="moviesArray.length > 4" v-for="movie in moviesArray" 
        :key="movie._id"
        @click="onSlideClick(movie._id)"
        :lazy="true"
        >
            <img loading="lazy" :src="movie.image_url" :alt="movie.title + ' poster'" />
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

.hidden{
   background-color: red;
   border-radius: 20px;
   height: 319px;
   min-width: 204px;
}

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
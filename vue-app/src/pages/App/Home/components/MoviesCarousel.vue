<script s>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Pagination } from 'swiper/modules';
import { useCarouselStore } from '@stores/carousel.js';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

import 'swiper/css';
import 'swiper/css/pagination';

export default {
    components: {
        Swiper,
        SwiperSlide,
    },
    setup() {
        const carouselStore = useCarouselStore();
        const { imagesArray, currentImageIndex } = storeToRefs(carouselStore);

        const currentMovie = computed(() => {
        return imagesArray.value[currentImageIndex.value] || {};
        });

        const onSwiper = (swiper) => {
            carouselStore.currentIndex = swiper.realIndex;
        };

        const onSlideChange = (swiper) => {
            carouselStore.currentIndex = swiper.realIndex;
        };

        return {
            modules: [Pagination],
            imagesArray,
            currentImageIndex,
            onSwiper,
            onSlideChange,
            currentMovie
        };
    },
}
</script>

<template>
    <swiper :initialSlide="2" :centeredSlides="true" :slidesPerView="'auto'" :spaceBetween="20" :loop="true" :pagination="{
        clickable: true,
        el: '.swiper-pagination',
    }" :modules="modules" class="mySwiper" @swiper="onSwiper" @slideChange="onSlideChange">
        <swiper-slide v-for="image in imagesArray" :key="image.id">
            <img :src="image.src" :alt="image.alt" />
        </swiper-slide>
        
        <div class="swiper-pagination" slot="pagination">
    </div>
    </swiper>
    <div class="movie-info">
        <h2 class="movie-title">{{ currentMovie.title }}</h2>
        <p class="movie-genre">{{ currentMovie.genre }}</p>
    </div>
</template>


<style scoped>
.swiper {
    width: 100%;
    min-height: 445px;
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
}

:deep(.swiper-pagination-bullet-active) {
  background: var(--primary-color);
  width: 24px;
  border-radius: 5px;
}

.movie-info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    top: -65px;
    position: relative;
    height: 0;
}

.movie-title {
    padding: 0;
    margin: 0;
    font-size: 2rem;
    color: var(--text-color);
    text-align: center;
}

.movie-genre {
    color: rgba(var(--text-color-rgb), 0.6);
    font-weight: 700;
    padding: 0;
    margin: 0;
}

</style>
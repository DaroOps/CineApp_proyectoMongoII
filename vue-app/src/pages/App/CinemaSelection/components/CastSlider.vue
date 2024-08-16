<!-- CastSlider.vue -->
<script setup>
import { defineProps } from 'vue'
import { Swiper, SwiperSlide  } from 'swiper/vue';
import {  FreeMode, Mousewheel } from 'swiper/modules';


const props = defineProps({
  cast: {
    type: Array,
    required: true
  }
})

const modules = [FreeMode, Mousewheel];

</script>

<template>
    <div class="cast-list">
      <h2 class="cast-title">Cast</h2>
      <div class="cast-flex">
        <swiper
        :modules="modules"
        :freeMode="false"
        :slidesPerView="'auto'"
        :spaceBetween="13"
        :loop="true"
        :mousewheel="false"
        >
          <swiper-slide v-for="member in cast" :key="member.name" class="cast-member">
            <div class="cast-photo-container">
              <img :src="member.actor?.img" :alt="member.name" class="cast-photo">
            </div>
            <div class="cast-info">
              <h3>{{ member.actor?.name }}</h3>
              <p>{{ member.role }}</p>
            </div>
          </swiper-slide>
        </swiper>
      
      </div>
    </div>
  </template>

  <!-- 
      <div v-for="member in cast" :key="member.name" class="cast-member">
          <div class="cast-photo-container">
            <img :src="member.actor_id?.image_url" :alt="member.name" class="cast-photo">
          </div>
          <div class="cast-info">
            <h3>{{ member.actor_id?.name }}</h3>
            <p>{{ member.role }}</p>
          </div>
        </div>   
  -->
  
  <style scoped>
  .cast-list {
    margin-left: 30px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .cast-title {
    font-size: 16px;
    color: var(--text-color);
    font-family: var(--font-inter);
    font-weight: 600;
    padding: 0;
    margin: 0;
  }

  .cast-member {
    display: flex;
    align-items: center;
    gap: 5px;
    max-width: fit-content;
  }
  .cast-photo-container {
    width: 41px;
    height: 41px;
    border-radius: 50%;
    overflow: hidden;
  }
  .cast-photo {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .cast-info h3 {
    margin: 0;
    color: var(--text-color);
    font-family: var(--font-poppins);
    font-weight: 600;
    font-size: 8px;
    text-wrap: nowrap
  }
  
  .cast-info p {
    margin: 0;
    font-size: 8px;
    text-wrap: nowrap;
    color: var(--text-color)
  }
  </style>
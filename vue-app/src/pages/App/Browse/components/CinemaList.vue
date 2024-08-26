<template>
    <div v-if="cinemas.length" class="cinema-list">
      <h2>Cinemas</h2>
      <ul>
        <li class="cinema-item" v-for="cinema in cinemas" :key="cinema.id">
          <img :src="cinema.image_url" :alt="cinema.name" />
          <div>
            <h3>{{ cinema.name }}</h3>
            <p>{{ cinema.location }}</p>
          </div>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    cinemas: {
      type: Array,
      required: true
    }
  });
  </script>

  <style lang="scss" scoped>
  .cinema-list {
    height: 100%;
    ul{
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
  }
  
  .cinema-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
    background-color: var(--background-color2);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  
    img {
      width: 100px;
      height: 100px;
      object-fit: cover;
      border-radius: 5px;
    }
  
    div {
      display: flex;    
      flex-direction: column;
      gap: 5px;
    }
  
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: var(--color-text-1);
    }
  
    p {
      font-size: 14px;
      color: var(--color-text-2);
    }
  }
  </style>
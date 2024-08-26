<template>
    <div v-if="actors.length" class="actor-list">
      <h2>Actors</h2>
      <ul>
        <li class="actor-item" v-for="actor in actors" :key="actor._id">
          <img class="actor-img" :src="actor.image_url" :alt="actor.name" />
          <h3>{{ actor.name }}</h3>
        </li>
      </ul>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue';
  
  defineProps({
    actors: {
      type: Array,
      required: true
    }
  });
  </script>

<style lang="scss" scoped>
    .actor-list {

        ul{
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .actor-item {
         background-color: var(--background-color2);   
         display: flex;
         border-radius: 10px;
         overflow: hidden;

            & img{
                aspect-ratio: 1/1;
                width: 50px;
                margin: 10px;
                border-radius: 50%;
                object-fit: cover;
            }

        }


    }
</style>
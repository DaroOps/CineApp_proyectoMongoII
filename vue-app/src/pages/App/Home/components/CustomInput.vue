<template>
    <div class="search-container">
      <input
        type="text"
        class="search-input"
        placeholder="Search movie, cinema, genre..."
        v-model="searchQuery"
        @input="onInput"
      >
      <span class="search-icon">
        <IconBar/>
      </span>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import IconBar from '@icons/nav/IconBar.vue'

  const searchQuery = ref('')
  
  const onInput = () => {
    console.log('Search query:', searchQuery.value)
  }
  </script>
  
  <style lang ="scss" scoped>
  .search-container {
    position: relative;
    width: 100%;
    

  }
  
  .search-input {
   
    width: 100%;
    padding: 15px 15px 15px 40px;
    border-radius: 10px;
    border: 0;
    outline: rgba(var(--text-color-rgb), 0.7) 1px solid;
    background: var(--background-linear);
    color: var(--text-color-rgb);
    font-size: 14px;

  }
  
  .search-input::placeholder {
    color: var(--text-color);
  }

  .search-input:focus{
    outline: rgba(var(--text-color-rgb), 0.7) 1px solid;
   }

  
  .search-icon {
    position: absolute;
    width: 14px;
    height: auto;
    left: 15px;
    top: 52%;
    transform: translateY(-50%);
    color: var(--text-color-rgb/70%);
  }
  </style>
<!-- SkeletonLoader.vue -->
<template>
    <div class="skeleton"></div>
  </template>
  
  <style lang="scss" scoped>
  .skeleton {
    width: 204px;
    height: 319px;
    background-color: #e0e0e0; 
    border-radius: 20px;
    animation: pulse 1.5s infinite;
  
    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: 0.4;
      }
      100% {
        opacity: 1;
      }
    }
  }
  </style>
  
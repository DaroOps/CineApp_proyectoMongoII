<!-- SkeletonLoader.vue -->
<template>
    <div class="skeleton"></div>
  </template>
  
  <style lang="scss" scoped>
  .skeleton {
    width: 100%;
    height: 100%;
    border-radius: inherit;
    background-color: #e0e0e00e; 
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
  
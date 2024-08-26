<template>
    <div class="notification">
      <div class="profile-pic">
        <img :src="profilePicUrl" alt="Profile picture" />
      </div>
      <div class="message">
        <p class="greeting">Hi, {{ name }}!</p>
        <p class="action">Let's watch movie together!</p>
      </div>
      <div class="notification-button">
          <div class="bell-icon">
            <IconBell />
          </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps } from 'vue'
  import IconBell from '@icons/nav/IconBell.vue'
  
  const props = defineProps({
    name: {
      type: String,
      default: 'John Doe',
      required: true
    },
    profilePicUrl: {
      type: String,
      default: 'https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg',
      required: true
    }
  })
  </script>
  
  <style scoped>
  .notification {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    color: var(--text-color);
    border-radius: 10px;
  }
  
  .profile-pic img {
    width: 48px;
    height: 48px;
    margin-right: 12px;
    border-radius: 50%;
  }
  
  .message {
    flex-grow: 1;
  }
  
  .greeting {
    font-weight: bold;
    margin: 0;
  }
  
  .action {
    margin: 0;
    opacity: 0.8;
  }
  
  .notification-button {
    display: flex;
    align-items: center;
    border: 1px solid rgba(var(--text-color-rgb), 0.5);;
    padding: 8px;
    justify-content: center;
    border-radius: 8px;
    cursor: pointer;
  }
  .bell-icon{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: var(--text-color);
  }
  </style>
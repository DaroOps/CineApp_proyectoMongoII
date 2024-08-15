<script setup>
  import { defineProps } from 'vue'
  import IconDots from '@icons/actions/IconDots.vue';
  import IconArrow from '@icons/actions/IconArrow.vue';


  const props = defineProps({
    headerText: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <div class="cinema-header">
    <span class="back-arrow" @click="$router.back()">
      <IconArrow />
    </span>
    <h1>{{ headerText }}</h1>
    <span class="menu-dots">
      <IconDots />
    </span>
  </div>
</template>

<style scoped>
.cinema-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  color: var(--text-color);
  padding:  33px;
}

.back-arrow {
  height: 24px;
  margin-right: 15px;
  cursor: pointer;
}

h1 {
  font-family: var(--font-inter);
  font-weight: 700;
  margin: 0;
  font-size: 18px;
}

.menu-dots {
  height: 24px;
  width: 24px;
  cursor: pointer;
}
</style>
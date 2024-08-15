<script setup>
  import { defineProps } from 'vue'
  import IconDots from '@icons/actions/IconDots.vue';
  import IconArrow from '@icons/actions/IconArrow.vue';

  import { useRouter } from 'vue-router';

  const router = useRouter();
  
  const props = defineProps({
    headerText: {
      type: String,
      required: true
    },
    onBackClick: {
    type: Function,
    default: () => {}
  }
  });

  function handleBackClick() {
    props.onBackClick?
    props.onBackClick():{};
    router.back();
  }

</script>

<template>
  <div class="cinema-header">
    <span class="back-arrow" @click="handleBackClick">
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
  padding:  33px 33px 6px 33px;
}

.back-arrow {
  height: 24px;
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
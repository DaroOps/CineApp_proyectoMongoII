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
    default: null
  },
  isDummy: {
    type: Boolean,
    default: false
  }
});

function handleBackClick() {
  if(props.onBackClick != null){
    props.onBackClick()
    return
  } 

  router.back()
}

</script>

<template>
  <div class="cinema-header " :class="{ dummy: isDummy }">
    <span class="back-arrow" @click="handleBackClick">
      <IconArrow />
    </span>
    <h1>{{ headerText }}</h1>
    <span class="menu-dots">
      <IconDots />
    </span>
  </div>
</template>

<style lang="scss" scoped>
.cinema-header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--text-color);
  padding: 20px 33px 6px 33px;

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

  &.dummy {
   position: absolute;
   top: 0;
    opacity: 0;
  }
}
</style>
<script setup>
defineOptions({ name: "NavLink" });
const props = defineProps({
  iconComponent: {
    type: Object,
    required: false,
  },
  pageName: {
    type: String,
    default: "Home",
  },
  text: {
    type: String,
    default: "button",
  },
});

import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isRouteCurrent = computed(() => {
  return route?.name?.toLowerCase() === props?.pageName?.toLowerCase();
});
</script>

<template>
  <div :class="['nav-link', { 'is-current-page': isRouteCurrent }]">
    <RouterLink :to="{ name: pageName }">
      <div class="link-content">
        <div class="link-icon">
          <component :is="iconComponent" />
        </div>
        <span class="link-text">
          {{ text }}
        </span>
      </div>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.nav-link {
  .link-icon {
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .link-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .link-icon {
      height: 20px;
      width: 20px;
    }
    .link-icon,
    .link-text {
      color: var(--text-color);
      transition: color 0.3s;
      font-family: var(--font-poppins);
      font-weight: 700;
      font-size: 10px;
    }
    &:hover {
    .link-icon,
    .link-text {
     
      color: var(--secondary-color);
    }
  }
  }
  /**.link-text {
    margin-left: 10px;
  }*/
  a {
    display: flex;
    align-items: center;
    padding: 0px 0;
    position: relative;
    justify-content: center;
    &:before {
      content: "";
      height: 0px;
      width: 0px;
      background: var(--primary-color);
      position: absolute;
      left: 0;
      display: block;
      opacity: 0;
      transition: 0.5s ease opacity;
    }
  }
 
}

.nav-link.is-current-page {
  a:before {
    opacity: 1;
  }
  .link-icon,
  .link-text {
    fill: var(--primary-color);
    color: var(--primary-color);
  }
}
</style>

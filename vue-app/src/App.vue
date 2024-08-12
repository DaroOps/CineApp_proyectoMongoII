<script setup>
// import { useThemeStore } from "@stores/theme";
import { storeToRefs } from "pinia";

// const themeStore = useThemeStore();
// const { isDarkTheme } = storeToRefs(themeStore);
</script>
<!-- 'is-dark-theme': isDarkTheme,
'is-light-theme': !isDarkTheme, -->

<template>
  <div
    :class="{
      App: true,
    }"
  >
    <RouterView />
  </div>
</template>

<style>
</style>

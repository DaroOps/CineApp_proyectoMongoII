<script setup>
import { useThemeStore } from "@stores/theme";
import { storeToRefs } from "pinia";

const themeStore = useThemeStore();
const { isDarkTheme } = storeToRefs(themeStore);
</script>

<template>
  <div
    :class="{
      App: true,
      'is-dark-theme': isDarkTheme,
      'is-light-theme': !isDarkTheme,
    }"
  >
    <RouterView />
  </div>
</template>

<style>
</style>

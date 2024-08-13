<script setup>
import Layout from '../../layouts/Layout.vue';
defineOptions({ name: 'AppPage' })
</script>

<template>
  <div class='app-page'>
    <Layout>
      <RouterView />
    </Layout>
  </div>
</template>

<style scoped>
</style>

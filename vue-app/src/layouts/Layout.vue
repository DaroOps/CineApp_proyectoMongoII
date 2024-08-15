<script setup>
import NavComponent from '@components/Nav/index.vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const requiresNav = computed(() => route.meta.requiresNav);

defineOptions({
    name: 'DashboardLayout'
})
</script>

<template>
    <div class="dashboard-layout">
        <main class="main">
            <slot />
        </main>
        <div v-show="requiresNav">
            <NavComponent />
        </div>
    </div>
</template>

<style scoped>
.dashboard-layout {
    background: var(--background-color);
    display: flex;
    flex-direction: column;
    /* height: 100%; */
    overflow-y: auto;
    /* width: 100vw; */
}

.dashboard-layout .main {
    display: flex;
    flex-direction: column;
    /* width: 100%; */
}
</style>
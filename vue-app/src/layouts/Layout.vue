<script setup>
import NavComponent from '@components/Nav/index.vue'

defineOptions({
    name: 'DashboardLayout'
})
</script>

<template>
    <div class="dashboard-layout">
        <main class="main">
            <slot />
        </main>
        <NavComponent />
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
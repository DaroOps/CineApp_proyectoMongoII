<script setup>
    import CinemaHeader from '@components/CinemaHeader/CinemaHeader.vue';
    import SeatMap from './components/SeatMap.vue';
    
</script>

<template>
    <CinemaHeader headerText="Choose Seat" />
    <div class="seat-map-container">
        <SeatMap />
    </div>
</template>

<style lang="css" scoped>

    .seat-map-container {
        padding: 0 25px 0 24px;
        overflow-x: auto;
    }

</style>

<script setup>
import CinemaHeader from "@components/CinemaHeader/CinemaHeader.vue";
import MovieSum from "./components/MovieSum.vue";
import Bill from "./components/Bill/Bill.vue";
</script>

<template>
    <div class="head">
        <div class="gradient"/>
            <CinemaHeader headerText="Order Summary" />    
        <MovieSum :movie="{}" />
    </div>
    <Bill/>

</template>

<style lang="scss" scoped>

.head{
    position: relative;
    .gradient{
        width: 100%;
        height: 100%;
        position: absolute;
        background: linear-gradient(to top right, 
        rgba(#272727, 1),
        rgba(#272727, 0) 
        );
        z-index: 0;
        pointer-events: none;
    }


}



</style>
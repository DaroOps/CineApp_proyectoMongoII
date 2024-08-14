<script setup>
import MoviesCarousel from './components/MoviesCarousel.vue'
import SeeAll from './components/SeeAll.vue'
import CustomInput from './components/CustomInput.vue';
import ProfileHead from './components/ProfileHead.vue'

</script>

<template>
    <div class="home">
        <div class="head">
            <div class="profile">
                <ProfileHead name="John Doe" profilePicUrl="https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg"/>
                <CustomInput/>
            </div>
            <SeeAll/>
        </div>
        <MoviesCarousel />
        <div class="botom">
            <SeeAll/>
        </div>
    </div>
</template>

<style scoped>
    .home {
        height: 100vh;
        width: 100%;
        display: flex;
        flex-direction: column;
    }
    .head{
        padding: 30px;
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .profile{
        display: flex;
        flex-direction: column;
        gap: 17px;
        width: 100%;
    }
    
    .botom{
        padding: 30px;
    }
</style>
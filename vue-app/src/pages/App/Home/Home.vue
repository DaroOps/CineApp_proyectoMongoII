<script setup>
import MoviesCarousel from './components/MoviesCarousel.vue'
import SeeAll from './components/SeeAll.vue'
import CustomInput from './components/CustomInput.vue';
import ProfileHead from './components/ProfileHead.vue'
import ComingSoon from './components/ComingSoon.vue';
import { useAuthStore } from '@stores/auth.js';

const authStore = useAuthStore();

</script>

<template>
    <div class="home">
        <div class="head">
            <div class="profile">
                <ProfileHead :name="authStore?.user?.name" :profilePicUrl="authStore?.user?.profileImage"/>
                <CustomInput/>
            </div>
            <SeeAll/>
        </div>
        <MoviesCarousel />
        <div class="botom">
            <SeeAll title="Coming Soon"/>
            <div class="coming-soon">
                <ComingSoon/>
                <ComingSoon/>
                <ComingSoon/>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .home {
        height: 100%;
        width: 100%;

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
        padding: 10px 30px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .coming-soon{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
</style>
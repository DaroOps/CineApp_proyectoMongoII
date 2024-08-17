<script setup>
import { ref, defineEmits } from 'vue'

defineEmits(['select'])

const props = defineProps({
    logoSrc: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    isSelected: {
    type: Boolean,
    default: false
    }
})


</script>

<template>
    <div :class="['cinema-card', { 'selected': isSelected }]" @click="$emit('select')">
        <div class="cinema-info">
            <p class="cinema-name">{{ name }}</p>
            <p class="cinema-location">{{ location }}</p>
        </div>
        <div class="logo-container">
            <img :src="logoSrc" :alt="name + ' logo'" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.cinema-card {
    height: 57px;
    width: 100%;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--background-color2);
    cursor: pointer;
    outline: 0px solid transparent;
    transition: outline 0.3s ease;
    
    .logo-container {
        width: 48.31px;
        height: 48px;
        border-radius: 5px;
        overflow: hidden;
        margin-right: 19.53px;
        & img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    .cinema-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 13.36px;
        & > p{
            margin: 0;
            padding: 0;
        }

        .cinema-name {
            font-family: var(--font-poppins);
            font-size: 13px;
            color: var(--text-color);
            font-weight: 600;
        }

        .cinema-location {
            font-family: var(--font-poppins);
            font-size: 10px;
            color: var(--text-color);
            font-weight: 300;
        }
    }


}



.cinema-card.selected {
    outline: 2px solid var(--primary-color);
    border-radius: 10px;
    transition: outline 0.3s ease;
}
</style>
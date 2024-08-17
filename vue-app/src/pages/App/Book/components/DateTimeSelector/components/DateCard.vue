<script setup>
import { defineEmits } from 'vue'
defineEmits(['select'])

const props = defineProps({
    number: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    isDaySelected: {
        type: Boolean,
        default: false
    }
})

</script>

<template>
       <div :class="['day-card', {'selected': isDaySelected}]"  @click="$emit('select')">
            <div class="day-name"> {{props.name? props.name : "Fri"}} </div>
            <div class="day-number"> {{props.number? props.number  : "22"}} </div>
        </div>
</template>

<style lang="scss" scoped>

.day-card {
    display: inline-block;
    height: 78px;
    width: 54px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: var(--background-color3);
    border-radius: 12px;
    text-align: center;
    line-height: 1;
    gap: 10px;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    
    .day-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--background-color2);
    }

    .day-number {
        font-size: 24px;
        font-weight: 700;
        color: var(--background-color2);
    }

    & > div {
        transition: all 0.3s ease;
    }
}

.day-card.selected {
    border-radius: 6px;
    background-color: var(--primary-color);
    gap: 8px;
    transition: all 0.3s ease;
    .day-name {
        color: var(--text-color);
        font-size: 14px;
        font-weight: 700;
    }

    .day-number {
        color: var(--text-color);
        font-weight: 700;
    }

    & > div {
        transition: all 0.3s ease;
    }
}


</style>    
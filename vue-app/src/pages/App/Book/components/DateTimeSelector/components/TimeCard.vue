<script setup>
import { defineEmits } from 'vue'

defineEmits(['select'])

const props = defineProps({
    time: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    isTimeSelected: {
        type: Boolean,
        default: false
    }
});



</script>

<template>
    <div :class="['time-slot', { 'selected': isTimeSelected }]" @click="$emit('select')">
        <div class="time"> {{ props.time ? props.time : "13:00" }} </div>
        <div class="price">$ {{ props.price ? props.price : "5.25" }}·{{ props.type ? props.type : "3D" }}</div>
    </div>
</template>

<style lang="scss" scoped>
.time-slot {
    background-color: var(--background-color3);
    border-radius: 12px;
    display: flex;
    min-height: 62px;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    line-height: 1;
    gap: 4px;
    padding: 8px 13px 11px 13px;
    transition: all 0.3s ease;

    .time {
        font-size: 20px;
        font-weight: 700;
        text-wrap: nowrap;
        color: var(--background-color2);
    }

    .price {
        color: var(--text-subtitle-color);
        text-wrap: nowrap;
        font-weight: 500;
        font-size: 13px;
    }

    & > div {
        transition: all 0.3s ease;
    }

}

.time-slot.selected {
    border-radius: 6px;
    background-color: var(--primary-color);

    .time {
    font-size: 20px;
    font-weight: 700;
    text-wrap: nowrap;
    color: var(--color-text);
    }

    .price {
        color: var(--text-color);
        text-wrap: nowrap;
        font-weight: 600;
        font-size: 13px;
    }

    & > div {
        transition: all 0.3s ease;
    }

}


</style>
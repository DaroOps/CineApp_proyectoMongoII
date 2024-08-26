<script setup>
import { defineEmits } from 'vue'

defineEmits(['select'])

const props = defineProps({
    logoSrc: {
        type: String,
        required: true,
        default: "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg"
    },
    name: {
        type: String,
        required: true,
        default: 'Master Card'
    },
    description: {
        type: String,
        required: true,
        default: '**** **** **** 0000'
    },
    isSelected: {
    type: Boolean,
    default: false
    }
})


</script>

<template>
    <div :class="['payment-card', { 'selected': isSelected }]" @click="$emit('select')">
        <div class="payment-info">
            <div class="logo-container">
                <img :src="logoSrc" :alt="name + ' logo'" />
            </div>
            <div class="payment-info">
                <p class="payment-name">{{ name }}</p>
                <p class="payment-description">{{ description }}</p>
            </div>
        </div>
        <span class="dot">
            <div class="dot-inner"/>
        </span>
    </div>
</template>

<style lang="scss" scoped>
.payment-card {
    height: 69.81px;
    width: 100%;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--background-color2);
    cursor: pointer;
    outline: 1px solid rgb(from var(--text-color) r g b / 20%);
    outline-offset: -1px;
    padding: 13.21px 18.87px 12.86px 14.15px;
  .payment-info {
    display: flex;
    gap: 13.82px;
    .logo-container {
        width: 66.03px;
        height: 43.74px;
        border-radius: 8px;
        overflow: hidden;
        // margin-right: 19.53px;
        & img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }

    .payment-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 11px;
        line-height: 1;
        // margin-left: 13.36px;
        & > p{
            margin: 0;
            padding: 0;
        }

        .payment-name {
            font-family: var(--font-poppins);
            font-size: 15px;
            color: var(--text-color);
            font-weight: 600;
            text-align: center
        }

        .payment-description {
            font-family: var(--font-poppins);
            font-size: 12px;
            color: var(--text-color);
            font-weight: 600;
        }
    }
  }
    
    

    .dot {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 21.7px;
        height: 21.7px;
        border-radius: 50%;
        outline: 1px solid var(--primary-color);
        outline-offset: -1px;
    
        .dot-inner {
            width: 0%;
            height: 0%;
            border-radius: 50%;
            background-color: var(--primary-color);
            transition: all 0.3s ease;
        }
    }

 

}

.payment-card.selected {
    .dot-inner{
        width: 14.46px;
        height: 14.46px;
        transition: all 0.3s ease;
    }
       
}


</style>
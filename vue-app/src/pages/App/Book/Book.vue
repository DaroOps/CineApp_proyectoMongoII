<script setup>
import CinemaHeader from '@components/CinemaHeader/CinemaHeader.vue';
import SeatMap from './components/SeatMap.vue';
import DateTimeSelector from './components/DateTimeSelector/DateTimeSelector.vue';
import { useScreeningStore } from '@stores/screenings.js';
import { useAuthStore } from '@stores/auth.js';
import { useRouter } from 'vue-router';
import { computed, onBeforeMount } from 'vue';
import { storeToRefs } from 'pinia';


const screeningStore = useScreeningStore();
const authStore = useAuthStore();
const { selectedDate, selectedTimeSlot, selectedSeats, totalPrice, selectedScreening } = storeToRefs(screeningStore);
const route = useRouter();
const paramvalue = route.currentRoute.value.params.id.split('-');

onBeforeMount(() => {
    console.log("before mount book");
    screeningStore.setUserType(authStore.user.role.type);
    screeningStore.currentRouteparams = paramvalue;
    screeningStore.getScreeningsForCinema(paramvalue[0], paramvalue[1]);
});

async function buyTicketClicked() {
    console.log('Buy ticket clicked');
    await screeningStore.reserveTicket();
    route.push(`/app/summary`);
}

const selectedInfo = computed(() => {
    return selectedDate.value && selectedTimeSlot.value && selectedSeats.value.length > 0;
});

</script>

<template>
    <CinemaHeader headerText="Choose Seat" />
    <div class="seat-map-container">
        <SeatMap />
    </div>
    <div class="date-time-container">
        <DateTimeSelector />
    </div>
    <div class="payment-container">
        <div class="seats-price-container">
            <span>Price</span>
            <span>$ {{ totalPrice.toFixed(2) }}</span>
        </div>
        <button class="buy-ticket-button" @click="buyTicketClicked" :disabled="!selectedInfo">
            <span>Buy Ticket</span>
        </button>
    </div>
</template>

<style lang="scss" scoped>
.seat-map-container {
    padding: 0 25px 0 24px;
    overflow-x: auto;
}

.date-time-container {
    padding: 24px 0 48px 30px;
    overflow-x: auto;
}

.payment-container {
    padding: 0 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .seats-price-container {
        display: flex;
        font-variant-numeric: tabular-nums;
        justify-content: center;
        flex-direction: column;

        & span:first-child {
            font-size: 18px;
            font-weight: 500;

        }

        & span:last-child {
            font-size: 20px;
            font-weight: 600;
            color: var(--text-color);
        }
    }

    .buy-ticket-button {
        height: 53px;
        font-family: var(--font-inter);
        font-weight: 600;
        font-size: 16px;
        color: var(--text-color);
        padding: 17px 71px;
        text-align: center;
        line-height: 1;

        &:disabled {
            background-color: var(--primary-color);
            cursor: not-allowed;
            opacity: 0.5;
            transition: all 0.3s ease;
        }
    }
}
</style>

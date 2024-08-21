<script setup>
    import CinemaHeader from '@components/CinemaHeader/CinemaHeader.vue';
    import SeatMap from './components/SeatMap.vue';
    import DateTimeSelector from './components/DateTimeSelector/DateTimeSelector.vue';
    import { useScreeningStore } from '@stores/screenings.js';
    import { useRouter } from 'vue-router';
    import { computed } from 'vue';

    const screeningStore = useScreeningStore();
    const router = useRouter();

    async function buyTicketClicked() {
        console.log('Buy ticket clicked');
        await screeningStore.reserveTicket();
        router.push(`/app/summary`);
    }


    const selectedInfo = computed(() => {
        return screeningStore.selectedDate && screeningStore.selectedTimeSlot && screeningStore.selectedSeats.length > 0;
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
            <span>$ {{screeningStore.totalPrice.toFixed(2)}}</span>
        </div>
        <button class="buy-ticket-button"  @click="buyTicketClicked" :disabled="!selectedInfo">
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

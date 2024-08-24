<script setup>
import CinemaHeader from "@components/CinemaHeader/CinemaHeader.vue";
import MovieSum from "./components/MovieSum.vue";
import Bill from "./components/Bill/Bill.vue";
import Timer from "./components/Timer.vue";
import PaymentCard from "./components/PaymentCard.vue";
import { useScreeningStore } from "@stores/screenings.js";
import { useTicketStore } from "@stores/tickets.js";
import { useRouter } from 'vue-router';


import { ref } from "vue";

const screeningStore = useScreeningStore();
const ticketStore = useTicketStore();
const router = useRouter();
const selectedCard = ref(null);

async function buyTicketClicked() {
    console.log('Buy ticket clicked');
    await ticketStore.confirmReservation(screeningStore.reserveInfo.reservation);
    router.push(`/app/ticket-swiper`);
}

async function onExpiration() {
    await screeningStore.abortReservation();
    router.back();
}

async function onbackClick() {
        router.back();
     await screeningStore.abortReservation();
}

async function selectPaymentCard(id) {
        id != selectedCard.value? selectedCard.value = id : selectedCard.value = null;
}

const cards = [{
    id: 1,
    logoSrc: "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg",
    name: "Master Card",
    description: "**** **** **** 0000"
},
{
    id: 2,
    logoSrc: "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg",
    name: "Master Card2",
    description: "**** **** **** 0000"
}
];

// const movie = useScreeningStore().reservationInfo.movie;
</script>

<template>
    <div class="head">
        <div class="gradient"/>
            <CinemaHeader headerText="Order Summary" :onBackClick="onbackClick" />
        <MovieSum 
            :movieVenue="screeningStore?.reserveInfo?.screening?.venue" 
            :movieShowtime="screeningStore?.reserveInfo?.screening?.dateTime" 
            :movie="screeningStore?.reserveInfo?.screening?.movie" 
        />
    </div>
    <div class="bill-container">
        <Bill :reservationNumber="screeningStore?.reserveInfo?.reservation" :data="screeningStore?.reserveInfo?.screening" />
    </div>
    <div class="payment-container">
        <h2 class="payment-title">Payment method</h2>
        <div class="payment-cards">
            <PaymentCard v-for="card in cards" 
            :key="card.id"
            :logoSrc="card.logoSrc" 
            :name="card.name" 
            :description="card.description"
            :isSelected="selectedCard === card.id"
            @select="selectPaymentCard(card.id)"
            />
        </div>
    </div>
    <div class="timer-container">
        <Timer :expirationTime="screeningStore?.reserveInfo?.expirationTime" :onExpiration="onExpiration" />
    </div>
    <div class="buy-ticket-container">
        <button class="buy-ticket-button" @click="buyTicketClicked" :disabled="!selectedCard">
          <span>Buy ticket</span>
        </button>
    </div>
   
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

.payment-container {
    display: flex;
    flex-direction: column;
    padding: 0 30px;
   .payment-title{
    margin:0;
    padding: 0;
   }

   .payment-cards{
       display: flex;
       gap: 10px;
       flex-direction: column;
       padding: 15.1px 0;
   }
   
}
.timer-container{
    padding: 0 30px 70px 30px;
}


.buy-ticket-container {
  width: 100%;
  height: fit-content;
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  background-color: var(--background-color);
  bottom: 0;
  left: 0;
  z-index: 10;

  .buy-ticket-button {
    width: 100%;
    height: 48px;
    background-color: var(--primary-color);
    color: var(--text-color);
    font-size: 16px;
    font-family: var(--font-inter);
    font-weight: 700;
    border-radius: 10px;
    border: none;
    cursor: pointer; 
    transition: all 0.3s ease;
    margin: 0px 30px 10px 30px;
  
    &:disabled {
      background-color: var(--primary-color);
      cursor: not-allowed;
      opacity: 0.5;
      transition: all 0.3s ease;
    }
  
    }
}
</style>
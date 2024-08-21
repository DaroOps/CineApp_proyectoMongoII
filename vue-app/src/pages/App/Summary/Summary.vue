<script setup>
import CinemaHeader from "@components/CinemaHeader/CinemaHeader.vue";
import MovieSum from "./components/MovieSum.vue";
import Bill from "./components/Bill/Bill.vue";
import Timer from "./components/Timer.vue";
import PaymentCard from "./components/PaymentCard.vue";
import { useScreeningStore } from "@stores/screenings.js";
import { ref } from "vue";

const screeningStore = useScreeningStore();

const selectedCard = ref(null);

async function selectPaymentCard(id) {
        id != selectedCard.value? selectedCard.value = id : selectedCard.value = null;
}

const cards = [{
    id: 1,
    logoSrc: "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg",
    name: "Master Card",
    description: "**** **** **** 0000"
},
// {
//     id: 2,
//     logoSrc: "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg",
//     name: "Master Card2",
//     description: "**** **** **** 0000"
// }
];

// const movie = useScreeningStore().reservationInfo.movie;
</script>

<template>
    <div class="head">
        <div class="gradient"/>
            <CinemaHeader headerText="Order Summary" />    
        <MovieSum 
            :movieVenue="screeningStore.reserveInfo.screening.venue" 
            :movieShowtime="screeningStore.reserveInfo.screening.dateTime" 
            :movie="screeningStore.reserveInfo.screening.movie" 
        />
    </div>
    <div class="bill-container">
        <Bill :reservationNumber="screeningStore.reserveInfo.reservation" :data="screeningStore?.reserveInfo?.screening" />
    </div>
    <div class="payment-container">
        <h2 class="payment-title">Payment method</h2>
        <PaymentCard v-for="card in cards" 
        :key="card.id"
        :logoSrc="card.logoSrc" 
        :name="card.name" 
        :description="card.description"
        :isSelected="selectedCard === card.id"
        @select="selectPaymentCard(card.id)"
        />
    </div>
    <div class="timer-container">
        <Timer :expirationTime="screeningStore.reserveInfo.expirationTime" :onExpiration="()=>{}" />
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
    gap: 10px;
}

</style>
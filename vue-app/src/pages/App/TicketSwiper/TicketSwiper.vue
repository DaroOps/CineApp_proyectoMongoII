<script setup>
 import CinemmaHeader from '@components/CinemaHeader/CinemaHeader.vue';
 import Ticket from '@components/Ticket/Ticket.vue';
 import { formatMovieShowtime } from '@utils/date.js';
 import { Swiper, SwiperSlide  } from 'swiper/vue';
 import {EffectCards} from 'swiper/modules';
 import 'swiper/css/effect-cards';
 import { useTicketStore } from '@stores/tickets.js';
import { computed } from 'vue';


 const ticketStore = useTicketStore();

 const tickets = computed(() => ticketStore.tickets);

 const modules = [
    EffectCards
  ];
  

</script>

<template>
  <div class="ticket-swiper-container">
    <CinemmaHeader headerText="Ticket" />
    <div class="tickets-container">
        <swiper
            :modules="modules"
            :effect="'cards'"
            class="my-swiper"
            >
            <swiper-slide v-for="ticket in tickets" :key="ticket.orderId">
                <Ticket
                    :posterUrl="ticket.movie.image"
                    :title="ticket.movie.title"
                    :cinema="ticket.cinema.location"
                    :date="formatMovieShowtime(ticket.screening_time).split(',')[0]"
                    :time="formatMovieShowtime(ticket.screening_time).split(',')[1]"
                    :cinemaHall="ticket.cinema.hall"
                    :cinemaImage="ticket.cinema.image"
                    :seat="ticket.seat.row + ticket.seat.number"
                    :cost="ticket.final_price"
                    :orderId="ticket._id"
                    class="ticket-swiper-item"
                />
            </swiper-slide>
      
        </swiper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ticket-swiper-container {
  background-color: var(--background-color);
  width: 100%;
  height: 100%;
  .tickets-container{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 44px;
      overflow-x:hidden;
      .swiper{
        width: 325px;
        height: 620px;
        
        //   background-color: rgb(from var(--background-color) r g b/ 0%);
        .swiper-slide{              
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 18px;
            font-size: 22px;
            
            }
        }
  }
 
}



</style>
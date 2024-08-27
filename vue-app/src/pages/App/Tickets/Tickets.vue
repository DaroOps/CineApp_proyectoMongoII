<script setup>

import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import {useTicketStore} from '@stores/tickets.js';
import {useAuthStore} from '@stores/auth.js';

import EmptyThree from '@icons/empty/EmptyThree.vue';

const router = useRouter();
const ticketStore = useTicketStore();
const authStore = useAuthStore();
import { storeToRefs } from 'pinia';

const { userTickets } = storeToRefs(ticketStore);

onMounted( () => {
   ticketStore.getUserTickets(authStore.user.id);
});

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' };
  return new Date(dateString).toLocaleDateString('en-EN', options);
};


const selectScreening = (index) => {
  ticketStore.setSelectedTickets(index);
  router.push('/app/ticket-swiper');
};

</script>

<template>
  <div class="tickets">
    <h1>Tickets</h1>
    <ul class="screening-list">
      <div class="no-tickets" v-if="!userTickets?.length">
        <EmptyThree />
        <p>You don have any tickets yet </p>
      </div>
      <li v-for="(screening, index) in userTickets" :key="screening.screening._id" class="screening-item" @click="selectScreening(index)">
        <div class="screening-info">
          <img :src="screening.screening.movie.image_url" :alt="screening.screening.movie.title" class="movie-poster">
          <div class="screening-details">
            <h3>{{ screening.screening.movie.title }}</h3>
            <p>{{ formatDate(screening.screening.screening_time) }}</p>
            <p>{{ screening.screening.cinema.name }}</p>
            <p>Tickets: {{ screening.tickets.length }}</p>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>

.tickets {
  padding: 30px;

  h1{

    margin: 0 0 0 0;
  }
  ul{
    padding: 0;
  }

  .screening-list{
      display: flex;
      flex-direction: column;
      gap: 20px;
      list-style: none;

     .no-tickets{
        display: flex;
        flex-direction: column;
        align-items: center;

        & p{
          font-size: 20px;
          margin: 0;
          font-weight: 700;
          color: var(--text-subtitle-color);
        }
     }

      .screening-info{
        display: flex;
        align-items: center;
        gap: 20px;
        cursor: pointer;
        background-color: var(--background-color2);
        padding: 0px 10px;
        border-radius: 10px;
        .movie-poster{
          width: 100px;
          height: 150px;
          object-fit: cover;
          border-radius: 10px;
        }
        
      }
    
  }
}

</style>
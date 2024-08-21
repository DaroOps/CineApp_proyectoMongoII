import { defineStore } from 'pinia'
import axios from 'axios';
import { useScreeningStore } from '@stores/screenings.js';

export const useTicketStore = defineStore('tickets', {
  state: () => ({
    reservation:[],
    tickets:[],
  }),
  actions: {
    async reserveTicket() {
      const {data} = await axios.post(`http://localhost:3000/api/tickets/reserve`, )
      this.movies = data;
    }

    
  },
})
import { defineStore } from 'pinia'
import axios from 'axios';
import { useScreeningStore } from '@stores/screenings.js';

export const useTicketStore = defineStore('tickets', {
  state: () => ({
     tickets : [
        {
            title: "Puss In Boots The Last Wish",
            cinema: "HARTONO MALL 12",
            date: "Sun, Feb 12th 2023",
            time: "13:00",
            cinemaHall: "Cinema A",
            seat: "C5",
            cost: "26.99",
            orderId: "12345678" 
        },
        {
            title: "Puss In Boots The Last Wish",
            cinema: "HARTONO MALL 12",
            date: "Sun, Feb 12th 2023",
            time: "13:00",
            cinemaHall: "Cinema A",
            seat: "C4",
            cost: "26.99",
            orderId: "12345678" 
        },
        {title: "Puss In Boots The Last Wish",
            cinema: "HARTONO MALL 12",
            date: "Sun, Feb 12th 2023",
            time: "13:00",
            cinemaHall: "Cinema A",
            seat: "C3",
            cost: "26.99",
            orderId: "12345678" 
        }
    ]
  }),
  actions: {
    async confirmReservation(tempReservationId) {
      console.log("confirmReservation", tempReservationId);
      const {data} = await axios.post(`http://localhost:3000/api/tickets/confirm`, {tempReservationId: tempReservationId})
      
      this.tickets = data;
    }
  },
})
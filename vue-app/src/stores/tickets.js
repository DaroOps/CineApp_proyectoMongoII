import { defineStore } from 'pinia'
import axios from 'axios';
import axiosInstance from "@plugins/axios.js";
import { formatMovieShowtime } from '@utils/date.js';
import { useScreeningStore } from '@stores/screenings.js';


export const useTicketStore = defineStore('tickets', {
  state: () => ({
     userTickets: {},
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
    async confirmReservation(tempReservationId, token) {
      console.log("confirmReservation - token", tempReservationId , token);
      const {data} = await axiosInstance.post(`/api/tickets/process-payment`, {tempReservationId: tempReservationId, token: token})
      
      this.tickets = data.tickets;
    },

    async getUserTickets(userId) {
      console.log("getUserTickets - userId", userId);
      
      const {data} = await axiosInstance.get(`/api/tickets/user-tickets?userId=${userId}`);
      console.log(data);
      
      this.userTickets = data;
    },

    setSelectedTickets(index) {
      if (index >= 0 && index < this.userTickets.length) {
        const selectedScreening = this.userTickets[index];
        this.tickets = selectedScreening.tickets.map(ticket => ({
          movie:{image:selectedScreening.screening.movie.image_url,
            title: selectedScreening.screening.movie.title
          },
          cinema:{location: selectedScreening.screening.cinema.location,
            image: selectedScreening.screening.cinema.image_url,
            hall: ticket.theater.name
          },
          screening_time: selectedScreening.screening.screening_time,
          seat: ticket.seat,
          final_price: ticket.final_price,
          _id: ticket._id
        }));

      } else {
        console.error('Invalid index');
      }
    },
  },
})
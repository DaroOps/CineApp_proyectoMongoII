// stores/screeningStore.js
import { defineStore } from 'pinia';
import axios from 'axios';
import axiosInstance from "@plugins/axios.js";
import { useSocketStore } from '@stores/socket.js';
import { useAuthStore } from '@stores/auth.js';
import { useRouter } from 'vue-router';




export const useScreeningStore = defineStore('screening', {
    state: () => ({
        screenings: [],
        seats: {
            A: [{ id: 'A1', disabled: false }, { id: 'A2', disabled: false }, { id: 'A3', disabled: false }, { id: 'A4', disabled: false }, { id: 'A5', disabled: false }],
            B: [{ id: 'B1', disabled: false }, { id: 'B2', disabled: false }, { id: 'B3', disabled: false }, { id: 'B4', disabled: false }, { id: 'B5', disabled: false }, { id: 'B6', disabled: false }, { id: 'B7', disabled: false }],
            C: [{ id: 'C1', disabled: false }, { id: 'C2', disabled: false }, { id: 'C3', disabled: false }, { id: 'C4', disabled: false }, { id: 'C5', disabled: false }, { id: 'C6', disabled: false }, { id: 'C7', disabled: false }, { id: 'C8', disabled: false }, { id: 'C9', disabled: false }],
            D: [{ id: 'D1', disabled: false }, { id: 'D2', disabled: false }, { id: 'D3', disabled: false }, { id: 'D4', disabled: false }, { id: 'D5', disabled: false }, { id: 'D6', disabled: false }, { id: 'D7', disabled: false }, { id: 'D8', disabled: false }, { id: 'D9', disabled: false }],
            E: [{ id: 'E1', disabled: false, isVIP: true }, { id: 'E2', disabled: false, isVIP: true }, { id: 'E3', disabled: false, isVIP: true }, { id: 'E4', disabled: false, isVIP: true }, { id: 'E5', disabled: false, isVIP: true }, { id: 'E6', disabled: false, isVIP: true }, { id: 'E7', disabled: false, isVIP: true }, { id: 'E8', disabled: false, isVIP: true }, { id: 'E9', disabled: false, isVIP: true }],
            F: [{ id: 'F1', disabled: false, isVIP: true }, { id: 'F2', disabled: false, isVIP: true }, { id: 'F3', disabled: false, isVIP: true }, { id: 'F4', disabled: false, isVIP: true }, { id: 'F5', disabled: false, isVIP: true }, { id: 'F6', disabled: false, isVIP: true }, { id: 'F7', disabled: false, isVIP: true }, { id: 'F8', disabled: false, isVIP: true }, { id: 'F9', disabled: false, isVIP: true }],
        },
        selectedSeats: [],
        screeningDays: [
            { weekday: 'Mon', day: '1' },
            // { weekday: 'Thu', day: '2' },
            // { weekday: 'Wed', day: '3' },
            // { weekday: 'Fri', day: '4' },
            // { weekday: 'Sat', day: '5' },
        ],
        timeSlots: [
            { time: '13:00', price: '5.25', type: '3D' },
            // { time: '15:45', price: '5.99', type: '3D' },
            // { time: '18:50', price: '4.50', type: '2D' },
            // { time: '20:30', price: '6.50', type: '2D' },
        ],
        timeSlotsByDay: {},
        selectedScreening: null,
        selectedDate: null,
        selectedTimeSlot: null,
        dateIndex: 0,
        timeSlotIndex: 0,
        userType: null, // 'standard' or 'vip'
        reserveInfo: null,
        currentRouteparams: null,
    }),

    actions: {
        toggleSeat(seatId) {
            const [row, number] = seatId.split('')
            const seat = this.seats[row].find(s => s.id === seatId)

            if (!seat.disabled) {
                const index = this.selectedSeats.indexOf(seatId)
                if (index > -1) {
                    this.selectedSeats.splice(index, 1)
                } else {
                    this.selectedSeats.push(seatId)
                }
                // console.log(`${seatId} ${seat.isVIP ? '(VIP)' : ''} ${index > -1 ? 'deselected' : 'selected'}`)
            }
        },
        setSelectedDate(date) {
            this.selectedDate = date;
            this.selectedTimeSlot = this.timeSlotsByDay[this.selectedDate.day][0];
            this.dateIndex = this.screeningDays.findIndex(day => day.day === date.day);
            this.updateAvailableTimeSlots();
        },
        setSelectedTimeSlot(timeSlot) {
            this.selectedTimeSlot = timeSlot
            this.timeSlotIndex = this.timeSlots.findIndex(slot => slot.time === timeSlot.time);
        },
        updateAvailableTimeSlots() {
            if (this.selectedDate && this.timeSlotsByDay[this.selectedDate.day]) {
                this.timeSlots = this.timeSlotsByDay[this.selectedDate.day];
            } else {
                this.timeSlots = [];
            }
        },
        clearSelections() {
            this.selectedSeats = []
            this.selectedDate = null
            this.selectedTimeSlot = null
        },

        setUserType(type) {
            if (type === 'standard' || type === 'VIP') {
                this.userType = type
            }
        },

        async abortReservation() {
            const { data } = await axiosInstance.post(`/api/tickets/abort`, {
                tempReservationId: this.reserveInfo.reservation
            })
            this.reserveInfo = data;
        },

        async getScreeningsForCinema(movieId, cinemaId) {
            // console.log('realoaded screenings');
            console.log(movieId, cinemaId);
            this.screenings = [];
            this.updateAvailableSeats();
            
            const response = await axiosInstance.get(`/api/screenings/${movieId}/${cinemaId}`);
            // console.log('Screenings:', response.data);
            this.screenings = response?.data;
            this.processScreenings(this.screenings);
            
            if(this.dateIndex > 0 || this.timeSlotIndex > 0)
            {
                console.log("special preload");

                this.setSelectedDate(this.screeningDays[this.dateIndex]);
                this.setSelectedTimeSlot(this.timeSlots[this.timeSlotIndex]);
            }
             else{
                console.log("deafult preload");
                
                this.selectedDate = this.screeningDays[0];
                this.selectedTimeSlot = this.timeSlotsByDay[this.selectedDate.day][0]; 
            }
        
            this.updateAvailableTimeSlots();
            this.updateAvailableSeats();
        },

        processScreenings(screenings) {
            this.screeningDays = Array.from(
                new Map(
                    screenings.map(screening => [
                        `${screening.weekday}-${screening.day}`,
                        { weekday: screening.weekday, day: screening.day }
                    ])
                ).values()
            ).sort((a, b) => a.day - b.day);

            //group the slots by day
            this.timeSlotsByDay = screenings.reduce((acc, screening) => {
                if (!acc[screening.day]) {
                    acc[screening.day] = [];
                }
                acc[screening.day].push({
                    time: screening.time,
                    price: screening.price,
                    type: screening.type
                });
                return acc;
            }, {});

            for (let day in this.timeSlotsByDay) {
                this.timeSlotsByDay[day].sort((a, b) => {
                    const timeA = a.time.split(':').map(Number);
                    const timeB = b.time.split(':').map(Number);
                    return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
                });
            }
        },
        updateAvailableSeats() {
            // console.log("updateAvailableSeats!!!!");

            if (!this.selectedDate || !this.selectedTimeSlot) {
                console.log('Date or time not selected');
                return;
            }

            const selectedScreening = this.screenings.find(screening => {
                return screening.day === this.selectedDate.day &&
                    screening.time === this.selectedTimeSlot.time;
            });

            if (selectedScreening && selectedScreening.seats) {
                this.seats = JSON.parse(JSON.stringify(selectedScreening.seats));
                this.selectedScreening = selectedScreening.id;
                // console.log('selectedScreening', selectedScreening, this.seats);
                useSocketStore().joinRoom(this.selectedScreening);


                if (this.selectedSeats && this.selectedSeats.length > 0) {
                    this.selectedSeats = this.selectedSeats.filter(seatId => {
                        const [row, seatNumber] = seatId.split('');
                        const seat = this.seats[row].find(s => s.id === seatId);
                        if (seat && seat.disabled) {
                            console.log(`Removing disabled seat ${seatId}`);
                            return false; // Remove this seat
                        }
                        return true; // Keep this seat
                    });
                }
            } else {
                console.log(`Cant found selected projection or doesn't have seats for day ${this.selectedDate.day} at ${this.selectedTimeSlot.time}`);
            }
        },
        async reserveTicket() {
            const authStore = useAuthStore();

            const { data } = await axiosInstance.post(`/api/tickets/reserve`, {
                userId: authStore.user.id,
                screeningId: this.selectedScreening,
                selectedSeats: this.selectedSeats.map(seat => ({ row: seat[0], number: parseInt(seat.slice(1)) }))
            })
            this.reserveInfo = data;
        },
        // async confirmReservation() {
        //     console.log("THIS SHOULDN'T BE CALLED!!!");
        //     const { data } = await axiosInstance.post(`/api/tickets/confirm`, {
        //         tempReservationId: this.reserveInfo.tempReservationId
        //     })
        //     this.reserveInfo = data;
        // },
        receivedSocketEvent() {
            console.log("receivedSocketEvent", this.currentRouteparams);
            this.getScreeningsForCinema(this.currentRouteparams[0], this.currentRouteparams[1]);
        },

        async rehidratate() {
            console.log("rehidratate");
            
            const authStore = useAuthStore();
            await authStore.fetchUser();
            this.setUserType(authStore?.user?.role?.type);
        }
       
    },


    getters: {
        totalSelectedSeats: (state) => state.selectedSeats.length,

        isVIPSeatSelected: (state) => {
            return state.selectedSeats.some(seatId => {
                const [row] = seatId.split('')
                return state.seats[row].find(s => s.id === seatId).isVIP
            })
        },

        totalPrice: (state) => {
            if (!state.selectedTimeSlot) return 0
            const basePrice = parseFloat(state.selectedTimeSlot.price)
            return state.selectedSeats.reduce((total, seatId) => {
                const [row] = seatId.split('')
                const seat = state.seats[row].find(s => s.id === seatId)
                let seatPrice = basePrice

                if (seat.isVIP) {
                    seatPrice = state.userType === 'VIP' ? basePrice : basePrice * 1.5 //TODO: retrieve this number from the database
                }

                return total + seatPrice
            }, 0)
        }
    }
})
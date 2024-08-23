// stores/screeningStore.js
import { defineStore } from 'pinia'
import axios from 'axios';

export const useScreeningStore = defineStore('screening', {
    state: () => ({
        screenings:[],
        seats: {
            A: [{ id: 'A1', disabled: false }, { id: 'A2', disabled: false }, { id: 'A3', disabled: false }, { id: 'A4', disabled: false }, { id: 'A5', disabled: false }],
            B: [{ id: 'B1', disabled: false }, { id: 'B2', disabled: false }, { id: 'B3', disabled: false }, { id: 'B4', disabled: false }, { id: 'B5', disabled: false }, { id: 'B6', disabled: false }, { id: 'B7', disabled: false }],
            C: [{ id: 'C1', disabled: false }, { id: 'C2', disabled: false }, { id: 'C3', disabled: true }, { id: 'C4', disabled: true }, { id: 'C5', disabled: true }, { id: 'C6', disabled: true }, { id: 'C7', disabled: true }, { id: 'C8', disabled: false }, { id: 'C9', disabled: false }],
            D: [{ id: 'D1', disabled: false }, { id: 'D2', disabled: false }, { id: 'D3', disabled: false }, { id: 'D4', disabled: false }, { id: 'D5', disabled: true }, { id: 'D6', disabled: false }, { id: 'D7', disabled: false }, { id: 'D8', disabled: false }, { id: 'D9', disabled: false }],
            E: [{ id: 'E1', disabled: false, isVIP: true }, { id: 'E2', disabled: false, isVIP: true }, { id: 'E3', disabled: false, isVIP: true }, { id: 'E4', disabled: false, isVIP: true }, { id: 'E5', disabled: true, isVIP: true }, { id: 'E6', disabled: false, isVIP: true }, { id: 'E7', disabled: false, isVIP: true }, { id: 'E8', disabled: false, isVIP: true }, { id: 'E9', disabled: false, isVIP: true }],
            F: [{ id: 'F1', disabled: false, isVIP: true }, { id: 'F2', disabled: false, isVIP: true }, { id: 'F3', disabled: false, isVIP: true }, { id: 'F4', disabled: false, isVIP: true }, { id: 'F5', disabled: true, isVIP: true }, { id: 'F6', disabled: false, isVIP: true }, { id: 'F7', disabled: false, isVIP: true }, { id: 'F8', disabled: false, isVIP: true }, { id: 'F9', disabled: false, isVIP: true }],
        },
        selectedSeats: [],
        screeningDays: [
            { weekday: 'Err', day: 'Er' },
            { weekday: 'Err', day: 'Er' },
            { weekday: 'Err', day: 'Er' },
            { weekday: 'Err', day: 'Er' },
            { weekday: 'Err', day: 'Er' },
        ],
        timeSlots:[
            { time: '13:00', price: '5.25', type: '3D' },
            { time: '15:45', price: '5.99', type: '3D' },
            { time: '18:50', price: '4.50', type: '2D' },
            { time: '20:30', price: '6.50', type: '2D' },
        ],
        timeSlotsByDay: {},
        selectedScreening: null,
        selectedDate: null,
        selectedTimeSlot: null,
        userType: 'regular', // 'regular' or 'vip'
        reserveInfo: null,
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
                console.log(`${seatId} ${seat.isVIP ? '(VIP)' : ''} ${index > -1 ? 'deselected' : 'selected'}`)
            }
        },

        setSelectedDate(date) {
            this.selectedDate = date;
            this.selectedTimeSlot = this.timeSlotsByDay[this.selectedDate.day][0];
            this.updateAvailableTimeSlots();
        },
        setSelectedTimeSlot(timeSlot) {
            this.selectedTimeSlot = timeSlot
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
            if (type === 'regular' || type === 'vip') {
                this.userType = type
            }
        },

        async getScreeningsForCinema(movieId, cinemaId) {
            const response = await axios.get(`http://localhost:3000/api/screenings/${movieId}/${cinemaId}`);
            // console.log('Screenings:', response.data);
            this.screenings = response?.data;
            this.processScreenings(this.screenings);
            this.selectedDate = this.screeningDays[0];
            this.selectedTimeSlot = this.timeSlotsByDay[this.selectedDate.day][0];
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
            if (!this.selectedDate || !this.selectedTimeSlot) {
                console.log('Fecha o hora no seleccionada');
                return;
            }
        
            const selectedScreening = this.screenings.find(screening => {
                return screening.day === this.selectedDate.day &&
                       screening.time === this.selectedTimeSlot.time;
            });
        
            if (selectedScreening && selectedScreening.seats) {
                // console.log(`Asientos para la proyección seleccionada: ${this.selectedDate.day} ${typeof(this.selectedDate.day)} ${this.selectedTimeSlot.time} ${typeof(this.selectedTimeSlot.time)}`, selectedScreening.seats);
                this.seats = JSON.parse(JSON.stringify(selectedScreening.seats));
                this.selectedScreening = selectedScreening.id;
                console.log('selectedScreening', selectedScreening);
                
            } else {
                // console.log(`No se encontró la proyección seleccionada o no tiene asientos para el día ${this.selectedDate.day} a las ${this.selectedTimeSlot.time}`);
            }
        },
        async reserveTicket() {
            const {data} = await axios.post(`http://localhost:3000/api/tickets/reserve`, {
                userId: "66c28adf555f528336310f72" , ////TODO: retrieve this number from the database
                screeningId: this.selectedScreening,
                selectedSeats: this.selectedSeats.map(seat => ({ row: seat[0], number:  parseInt(seat.slice(1)) }))
            })
            this.reserveInfo = data;
        },
        async confirmReservation() {
            const {data} = await axios.post(`http://localhost:3000/api/tickets/confirm`, {
                tempReservationId: this.reserveInfo.tempReservationId
            })
            this.reserveInfo = data;
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
                    seatPrice = state.userType === 'vip' ? basePrice : basePrice * 1.5 //TODO: retrieve this number from the database
                }

                return total + seatPrice
            }, 0)
        }
    }
})
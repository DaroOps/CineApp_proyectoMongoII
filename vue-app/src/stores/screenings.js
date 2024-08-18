// stores/screeningStore.js
import { defineStore } from 'pinia'
import axios from 'axios';

export const useScreeningStore = defineStore('screening', {
    state: () => ({
        seats: {
            A: [{ id: 'A1', disabled: true }, { id: 'A2', disabled: true }, { id: 'A3', disabled: true }, { id: 'A4', disabled: false }, { id: 'A5', disabled: true }],
            B: [{ id: 'B1', disabled: true }, { id: 'B2', disabled: true }, { id: 'B3', disabled: true }, { id: 'B4', disabled: true }, { id: 'B5', disabled: false }, { id: 'B6', disabled: true }, { id: 'B7', disabled: true }],
            C: [{ id: 'C1', disabled: false }, { id: 'C2', disabled: false }, { id: 'C3', disabled: false }, { id: 'C4', disabled: false }, { id: 'C5', disabled: false }, { id: 'C6', disabled: false }, { id: 'C7', disabled: false }, { id: 'C8', disabled: false }, { id: 'C9', disabled: false }],
            D: [{ id: 'D1', disabled: false }, { id: 'D2', disabled: false }, { id: 'D3', disabled: false }, { id: 'D4', disabled: false }, { id: 'D5', disabled: false }, { id: 'D6', disabled: false }, { id: 'D7', disabled: false }, { id: 'D8', disabled: false }, { id: 'D9', disabled: false }],
            E: [{ id: 'E1', disabled: false, isVIP: true }, { id: 'E2', disabled: false, isVIP: true }, { id: 'E3', disabled: false, isVIP: true }, { id: 'E4', disabled: false, isVIP: true }, { id: 'E5', disabled: false, isVIP: true }, { id: 'E6', disabled: false, isVIP: true }, { id: 'E7', disabled: false, isVIP: true }, { id: 'E8', disabled: false, isVIP: true }, { id: 'E9', disabled: false, isVIP: true }],
            F: [{ id: 'F1', disabled: false, isVIP: true }, { id: 'F2', disabled: false, isVIP: true }, { id: 'F3', disabled: false, isVIP: true }, { id: 'F4', disabled: false, isVIP: true }, { id: 'F5', disabled: false, isVIP: true }, { id: 'F6', disabled: false, isVIP: true }, { id: 'F7', disabled: false, isVIP: true }, { id: 'F8', disabled: false, isVIP: true }, { id: 'F9', disabled: false, isVIP: true }],
        },
        selectedSeats: [],
        screeningDays: [
            { weekday: 'Fri', day: '17' },
            { weekday: 'Sat', day: '18' },
            { weekday: 'Sun', day: '19' },
            { weekday: 'Mon', day: '20' },
            { weekday: 'Tue', day: '21' },
        ],
        timeSlots:[
            { time: '13:00', price: '5.25', type: '3D' },
            { time: '15:45', price: '5.99', type: '3D' },
            { time: '18:50', price: '4.50', type: '2D' },
            { time: '20:30', price: '6.50', type: '2D' },
        ],
        selectedDate: null,
        selectedTimeSlot: null,
        userType: 'regular', // 'regular' or 'vip'
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
            this.selectedDate = date
        },

        setSelectedTimeSlot(timeSlot) {
            this.selectedTimeSlot = timeSlot
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
            console.log('Screenings:', response.data);
            
            this.processScreenings(response.data);
        },

        processScreenings(screenings) {
            this.screeningDays = screenings.map(screening => {
               return [{ weekday: screening.weekday, day: screening.day }]
            });
           
            this.timeSlots = screenings.map(screening => {
                return { time: screening.time, price: screening.price, type: "3D" }
            });
        },

        
    // "id": "66c12a1f4856759ab9324697",
    // "movie": "66a1293e41165c14ebdd4f6d",
    // "theater": "66a1294d41165c14ebdd4f70",
    // "time": "09:00",
    // "day": 18,
    // "weekday": "Sun",
    // "price": 5.25,
    // "available_seats": 48

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
                    seatPrice = state.userType === 'vip' ? basePrice : basePrice * 2
                }

                return total + seatPrice
            }, 0)
        }
    }
})
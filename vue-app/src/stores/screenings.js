// stores/screeningStore.js
import { defineStore } from 'pinia'

export const useScreeningStore = defineStore('screening', {
  state: () => ({
    seats: {
        A: [{ id: 'A1', disabled: true }, { id: 'A2', disabled: true }, { id: 'A3', disabled: true }, { id: 'A4', disabled: true }, { id: 'A5', disabled: true }],
        B: [{ id: 'B1', disabled: true }, { id: 'B2', disabled: true }, { id: 'B3', disabled: true }, { id: 'B4', disabled: true }, { id: 'B5', disabled: true }, { id: 'B6', disabled: true }, { id: 'B7', disabled: true }],
        C: [{ id: 'C1', disabled: false }, { id: 'C2', disabled: false }, { id: 'C3', disabled: false }, { id: 'C4', disabled: false }, { id: 'C5', disabled: false }, { id: 'C6', disabled: false }, { id: 'C7', disabled: false }, { id: 'C8', disabled: false }, { id: 'C9', disabled: false }],
        D: [{ id: 'D1', disabled: false }, { id: 'D2', disabled: false }, { id: 'D3', disabled: false }, { id: 'D4', disabled: false }, { id: 'D5', disabled: false }, { id: 'D6', disabled: false }, { id: 'D7', disabled: false }, { id: 'D8', disabled: false }, { id: 'D9', disabled: false }],
        E: [{ id: 'E1', disabled: false, isVIP: true }, { id: 'E2', disabled: false, isVIP: true }, { id: 'E3', disabled: false, isVIP: true }, { id: 'E4', disabled: false, isVIP: true }, { id: 'E5', disabled: false, isVIP: true }, { id: 'E6', disabled: false, isVIP: true }, { id: 'E7', disabled: false, isVIP: true }, { id: 'E8', disabled: false, isVIP: true }, { id: 'E9', disabled: false, isVIP: true }],
        F: [{ id: 'F1', disabled: false, isVIP: true }, { id: 'F2', disabled: false, isVIP: true }, { id: 'F3', disabled: false, isVIP: true }, { id: 'F4', disabled: false, isVIP: true }, { id: 'F5', disabled: false, isVIP: true }, { id: 'F6', disabled: false, isVIP: true }, { id: 'F7', disabled: false, isVIP: true }, { id: 'F8', disabled: false, isVIP: true }, { id: 'F9', disabled: false, isVIP: true }],
      },
    selectedSeats: []
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
          console.log(`${row}${number} ${seat.isVIP ? '(VIP)' : ''}`)
      }
    }
  }
})
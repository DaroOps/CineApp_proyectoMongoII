<!-- SeatMap.vue -->
<script setup>
import { useScreeningStore } from '@stores/screenings.js'
import { storeToRefs } from 'pinia';

import IconScreen from '@icons/static/IconScreen.vue';

const screeningStore = useScreeningStore()
const { seats, selectedSeats } = storeToRefs(screeningStore)
const { toggleSeat } = screeningStore
</script>

<template>
  <div class="seat-map">
    <div class="screen">
      <IconScreen/>
    </div>
    <div v-for="(row, letter) in seats" :key="letter" class="row">
      <span class="row-letter" :id="letter">{{ letter }}</span>
      <div class="seats" :id="letter">
        <button 
          v-for="seat in row" 
          :key="seat.id"
          :class="['seat', { 'disabled': seat.disabled, 'selected': selectedSeats.includes(seat.id) }]"
          @click="toggleSeat(seat.id)"
          :disabled="seat.disabled"
          >
          {{ selectedSeats.includes(seat.id) ? seat.id.slice(1) : '' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.seat-map {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 364px;
}

.screen {
  display: flex;
  justify-content: center;

  margin: 14px 42px  41px 59px;
}

.row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-letter {
  width: 9px;
  font-size: 12px;
  font-family: var(--font-inter);
  font-weight: 500;
 
  text-align: center;
}

.row #B{
 margin-bottom: 43px;
}


.seats {
  width: 100%;
  gap: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.seat {
  width: 31px;
  height: 31px;
  aspect-ratio: 1/1;
  border: 0;
  background-color: var(--background-color2);
  cursor: pointer;
}

.seat.disabled {
  background-color: var(--seat-reserved-color);
  cursor: not-allowed;
}

.seat.selected {
  background-color: var(--primary-color);
  color: var(--text-color);
  font-weight: 700;
  font-family: poppins;
  font-size: 18px;
}
</style>
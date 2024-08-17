<!-- SeatMap.vue -->
<script setup>
import { useScreeningStore } from '@stores/screenings.js'
import { storeToRefs } from 'pinia';

import IconScreen from '@icons/static/IconScreen.vue';

const screeningStore = useScreeningStore()
const { seats, selectedSeats } = storeToRefs(screeningStore)
const { toggleSeat } = screeningStore

const tagsArray = [
  { id: 1, text: 'Available' , color: 'var(--background-color2)' },
  { id: 2, text: 'Reserved' , color: 'var(--seat-reserved-color)' },
  { id: 3, text: 'Selected' , color: 'var(--primary-color)' },
  { id: 4, text: 'VIP' , color: 'var(--vip-color)' },
];

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
          :class="['seat', { 
            'disabled': seat.disabled,
            'selected': selectedSeats.includes(seat.id),
            'vip': seat.isVIP && selectedSeats.includes(seat.id)
          }]"
          @click="toggleSeat(seat.id)"
          :disabled="seat.disabled"
          >
          {{ selectedSeats.includes(seat.id) ? seat.id.slice(1) : '' }}
        </button>
      </div>
    </div>
    <div class="seat-map-footer">
      <div v-for="tag in tagsArray" :key="tag.id" class="tag">
        <div :style="{ backgroundColor: tag.color }" class="dot"/>
        <span class="tag-text">{{ tag.text }}</span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.seat.vip {
  background-color: var(--vip-color);
}

.seat-map-footer {
  display: flex;
  gap: 31px;
  justify-content: center;
  margin-left: 0px;
  margin-top: 32px;

  & .tag{
    display: flex;
    gap: 10px;
    align-items: center;
    & .dot{
      width: 12px;
      height: 12px;
      border-radius: 50%;
    }
    & .tag-text{
      font-size: 12px;
      font-family: var(--font-inter);
      font-weight: 500;
      color: var(--text-color);
    }
  }
  
}

</style>
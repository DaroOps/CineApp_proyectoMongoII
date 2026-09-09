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
      <div class="seats" :id="letter" :style="{ '--butacas-por-fila': row.length }">
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

.seats {
  /* Las butacas se reparten el ancho que haya: una sala de 20 por fila cabe en
     un movil sin scroll horizontal, y una de 9 sigue viendose como antes. El
     numero de columnas lo pone la propia fila. */
  width: 100%;
  display: grid;
  grid-template-columns: repeat(var(--butacas-por-fila, 10), 1fr);
  gap: clamp(2px, 1vw, 6px);
  align-items: center;
}

.seat {
  width: 100%;
  max-width: 31px;
  height: auto;
  aspect-ratio: 1/1;
  justify-self: center;
  border: 0;
  background-color: var(--background-color2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.seat.disabled {
  background-color: var(--seat-reserved-color);
  cursor: not-allowed;
  transition: all 0.3s ease;
}

.seat.selected {
  background-color: var(--primary-color);
  color: var(--text-color);
  font-weight: 700;
  font-family: poppins;
  /* el numero tiene que caber dentro de la butaca, que ya no mide siempre 31px */
  font-size: clamp(8px, 2.6vw, 18px);
  line-height: 1;
  transition: all 0.3s ease;
}

.seat.vip {
  background-color: var(--vip-color);
  transition: all 0.3s ease;
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
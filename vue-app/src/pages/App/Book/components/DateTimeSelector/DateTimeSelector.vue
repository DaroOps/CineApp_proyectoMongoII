<script setup>
import { onMounted, ref,computed } from 'vue';
import { useScreeningStore } from '@stores/screenings.js';
import { storeToRefs } from 'pinia';
import DateCard from './components/DateCard.vue';
import TimeCard from './components/TimeCard.vue';

const screeningStore = useScreeningStore();

const { dateIndex, timeSlotIndex } = storeToRefs(screeningStore);


const selectedDateIndex = ref(null);
const selectedTimeIndex = ref(null);

onMounted(() => {

    if(dateIndex.value > 0 || timeSlotIndex.value > 0)
    {
        selectDateSlot(dateIndex.value);
        selectTimeSlot(timeSlotIndex.value);
    }
    else{
           selectedDateIndex.value = 0;
            selectedTimeIndex.value = 0;
    }


    // selectDateSlot(dateIndex);
    // selectTimeSlot(timeSlotIndex);
});


function selectDateSlot(index) {
    selectedDateIndex.value = index;
    screeningStore.setSelectedDate(screeningStore.screeningDays[index]);
    selectedTimeIndex.value = 0;
    updateAvailableSeats();
}

function selectTimeSlot(index) {
    selectedTimeIndex.value = index;
    screeningStore.setSelectedTimeSlot(screeningStore.timeSlots[index]);
    updateAvailableSeats();
}

function updateAvailableSeats() {
    screeningStore.updateAvailableSeats();  
}

</script>

<template>
    <div class="screening-times">
        <div class="day-cards">
            <DateCard v-for="(date, index) in screeningStore.screeningDays" 
            :key="index"
            :number="date.day"
            :name="date.weekday"
            :isDaySelected="selectedDateIndex === index"
            @select="selectDateSlot(index)"
            />
        </div>
        <div class="time-cards">
            <TimeCard v-for="(time, index) in screeningStore.timeSlots" 
            :key="index"
            :time="time.time"
            :price="time.price"
            :type="time.type"
            :isTimeSelected="selectedTimeIndex === index"
            @select="selectTimeSlot(index)"
            />
        </div>
    </div>
</template>

<style scoped>
.screening-times {
    width: 100%;
    display: flex;
    flex-direction: column;
    color: #fff;
    gap: 19px;
}

.day-cards {
    display: flex;
    overflow-x: auto;
    gap: 16px;
}

.time-cards {
    display: flex;
    overflow-x: auto;
    gap: 18px;
}

</style>
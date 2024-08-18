<script setup>
import { onMounted, ref } from 'vue';
import { useScreeningStore } from '@stores/screenings.js';
import DateCard from './components/DateCard.vue';
import TimeCard from './components/TimeCard.vue';

const screeningStore = useScreeningStore();

const selectedDateIndex = ref(null);
const selectedTimeIndex = ref(null);

onMounted(() => {
    selectedDateIndex.value = 0;
    selectedTimeIndex.value = 0;

    selectDateSlot(0);
    selectTimeSlot(0);
});

function selectDateSlot(index) {
    selectedDateIndex.value = index;
    screeningStore.setSelectedDate(screeningStore.screeningDays[index]);
}

function selectTimeSlot(index) {
    selectedTimeIndex.value = index;
    screeningStore.setSelectedTimeSlot(screeningStore.timeSlots[index]);
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
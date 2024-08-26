<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'

export default {
    props: {
        expirationTime: {
            type: String,
            required: true
        },
        onExpiration: {
            type: Function,
            required: true
        }
    },
    setup(props) {
        const timer = ref(null)
        const timeRemaining = ref(0)

        const formattedTime = computed(() => {
            const minutes = Math.floor(timeRemaining.value / 60)
            const seconds = timeRemaining.value % 60
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        })

        const startTimer = () => {
            const expirationDate = new Date(props.expirationTime)
            timeRemaining.value = Math.max(0, Math.floor((expirationDate.getTime() - Date.now()) / 1000))

            timer.value = setInterval(() => {
                timeRemaining.value--
                if (timeRemaining.value === 0) {
                    stopTimer()
                    props.onExpiration()
                }
            }, 1000)
        }

        const stopTimer = () => {
            clearInterval(timer.value)
        }

        onMounted(() => {
            startTimer()
        })

        onUnmounted(() => {
            stopTimer()
        })

        return {
            formattedTime
        }
    }
}
</script>

<template>
    <div class="countdown-timer">
        <p class="advertisement">Complete your payment in</p>
        <span class="timer">{{ formattedTime }}</span>
    </div>
</template>

<style lang="scss" scoped>
.countdown-timer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: var(--font-inter);
    padding: 13px 16px 13px 15px;
    background-color: var(--dark-primary-color);
    border-radius: 10px;
    .advertisement{
        margin: 0;
        padding: 0;
        font-weight: 600;
        font-size: 13px;
        color: rgb(from var(--text-color) r g b / 80%);
    }

    .timer {
        font-weight: 600;
        font-size: 13px;
        color: rgb(from var(--primary-color) r g b / 80%);
        padding: 0rem;
    }
}


</style>
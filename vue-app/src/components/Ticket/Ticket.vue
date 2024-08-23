<script setup>
import { defineProps } from 'vue';
//   import 'swiper/css/effect-cards';

defineProps({
  posterUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  cinema: {
    type: String,
    required: true,
  },
  cinemaImage: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  cinemaHall: {
    type: String,
    required: true,
  },
  seat: {
    type: String,
    required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  orderId: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div class="ticket-container">
    <div class="ticket-header">
      <div class="ticket-poster">
        <img :src="posterUrl" alt="movie poster">
      </div>
      <div class="ticket-title">
        <h2>{{ title }}</h2>
        <p>Show this ticket at the entrance</p>
      </div>
    </div>
    <div class="ticket-details">

      <div class="cinema-details">
        <div class="cinema-info">
          <span>Cinema</span>
          <p>{{ cinema }}</p>
        </div>
        <img :src="cinemaImage" alt="cinema image">
      </div>

      <div class="granular-details">
        <div class="date-hall-cost">
          <div class="date">
            <span>Date</span>
            <p>{{ date }}</p>
          </div>
          <div class="hall">
            <span>Cinema Hall #</span>
            <p>{{ cinemaHall }}</p>
          </div>
          <div class="cost">
            <span>Cost</span>
            <p>${{ cost }}</p>
          </div>
        </div>
        <div class="time-seat-order">
          <div class="time">
            <span>Time</span>
            <p>{{ time }}</p>
          </div>
          <div class="seat">
            <span>Seat</span>
            <p>{{ seat }}</p>
          </div>
          <div class="order">
            <span>Order ID</span>
            <p>{{ orderId }}</p>
          </div>
        </div>
      </div>


    </div>
    <div class="ticket-barcode">
      <vue-barcode :value="orderId" :options="{ width: 1, height: 46, displayValue: false, margin: 0 }"></vue-barcode>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ticket-container {
  background-color: var(--text-color);
  padding: 26px 0 0px 0;

  border-radius: 20px;
  width: 325px;
  // height: 620px;
  color: black;

  .ticket-header {
    line-height: 1;
    border-bottom: 1px solid #D9D9D9;
    font-family: var(--font-poppins);
    text-align: left;
    padding: 0 19px 31px 23px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    gap: 14px;

    .ticket-poster {
      width: 283px;
      height: 113px;
      border-radius: 10px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .ticket-title {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      gap: 13px;

      & h2 {
        margin: 0;
        padding: 0;
        font-size: 20px;
        font-weight: 800;
        color: var(--dark-text-color);

      }

      & p {
        margin: 0;
        padding: 0;
        font-size: 13px;
        font-weight: 400;
        color: var(--dark-subtitle-text-color);
      }
    }


  }

  .ticket-details {
    margin: 0;


    .cinema-details {
      padding: 14.78px 19px 42px 23px;
      display: flex;
      align-items: center;
      gap: 57px;
      justify-content: space-between;
      font-family: var(--font-poppins);
      

      .cinema-info {
        line-height: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 5px;

        & span {
          font-size: 13px;
          font-weight: 800;
          color: var(--dark-subtitle-text-color);
        }

        & p {
          margin: 0;
          font-size: 20px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--dark-text-color);
          // white-space: nowrap;
          // text-overflow: ellipsis;
          // overflow: hidden;
        }

      }

      & img {
        width: 48px;
        height: 48px;
        border-radius: 5px;
      }
    }


    .granular-details {
      background-image: linear-gradient(to right, black 50%, transparent 50%);
      background-size: 15px 1px;
      background-repeat: repeat-x;
      background-position: bottom;
      padding-bottom: 3px;

      display: flex;
      justify-content: space-between;
      gap: 56px;
      overflow: hidden;
      line-height: 1;
      padding: 0 0 21px 0;

      & span {
        font-size: 13px;
        font-weight: 800;
        color: var(--dark-subtitle-text-color);
      }

      & p {
        margin: 0;
        font-size: 15px;
        font-weight: 800;
        color: var(--dark-text-color);
        // text-wrap: nowrap;
        // white-space: nowrap;
        // text-overflow: ellipsis;
      }

      .date-hall-cost {
        display: flex;
        flex-direction: column;
        padding: 0 0 0 23px;
        width: 100%;
        gap: 19px;

        & .date {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        & .hall {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        & .cost {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }


      }

      .time-seat-order {

        display: flex;
        flex-direction: column;
        padding: 0 19px 0 0;
        gap: 19px;

        & .time {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        & .seat {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        & .order {
          display: flex;
          flex-direction: column;
          gap: 7px;

          & p {
            line-break: anywhere
          }
        }
      }
    }

    
  }
  
  .ticket-barcode{
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 17px 29px 20px 29px;
  }


}


</style>
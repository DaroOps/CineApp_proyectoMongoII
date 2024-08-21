<script setup>
import { computed } from 'vue';
import ItemReview from './components/ItemReview.vue'

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    reservationNumber: {
        type: String,
        required: true,
        default: ''
    }
})


const processedData = computed(() => {
  const seatGroups = props.data.tickets.reduce((acc, ticket) => {
    const key = ticket.seatType.toUpperCase();
    if (!acc[key]) {
      acc[key] = { seats: [], price: parseFloat(ticket.finalPrice), count: 0 };
    }
    acc[key].seats.push(ticket.seat);
    acc[key].count++;
    return acc;
  }, {});

  const items = Object.entries(seatGroups).map(([type, info]) => ({
    name: `${seatGroups[type].seats.length} ${seatGroups[type].seats.length > 1 ? 'SEATS' : 'SEAT'} ${type}`,
    price: `${info.seats.join(' ')}`,
    quantity: null
  }));

  Object.entries(seatGroups).map(([type, info]) => ({
    name: `${type} SEAT`,
    price: parseFloat(info.price).toFixed(2),
    quantity: info.count
  })).forEach(item => {
    items.push(item);
  });

  items.push({
    name: 'SERVICE FEE',
    price: parseFloat(props.data.serviceFee).toFixed(2),
    quantity: 1
  });

  items.push({ name: 'TOTAL', price: "$"+parseFloat(props.data.total).toFixed(2), quantity: null });

  return items;
});
</script>

<template>
    <div class="bill">
        <div class="bill-header">
            <p class="order-number">Order number</p>
            <p class="id-order">{{props.reservationNumber}}</p>
        </div>
        <div class="bill-card">
            <ItemReview 
                v-for="(item, index) in processedData" 
                :key="index"
                :name="item.name"
                :price="item.quantity ? `$${item.price} x ${item.quantity}` : item.price"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.bill{
    display: flex;
    flex-direction: column;
    gap: 25px;
    padding: 20px 30px 30px 25px;
    .bill-header {
        display: flex;
        text-transform: uppercase;
        margin: 0;
        line-height: 1;
        font-family: var(--font-inter);
        font-size: 13px;
        font-weight: 700;
        
        & > p {
            margin: 0;
        }

        .order-number {
            color: rgb(from var(--text-color) r g b / 50% );
            &::after {
                white-space: pre;
                content: ': ';
            }
        }
        
        .id-order {

            color: var(--text-color);

        }
    }

    .bill-card {
        display: flex;
        flex-direction: column;
        gap: 15px;
        
    }

}
</style>
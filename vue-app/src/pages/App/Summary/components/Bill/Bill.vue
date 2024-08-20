<script setup>
import { computed } from 'vue';
import ItemReview from './components/ItemReview.vue'

const data = {
    "tickets": [
        { "seat": "A1", "seatType": "vip", "finalPrice": 7.25 },
        { "seat": "A2", "seatType": "vip", "finalPrice": 7.25 },
        { "seat": "B3", "seatType": "standard", "finalPrice": 5.25 },
        { "seat": "B5", "seatType": "standard", "finalPrice": 5.25 },
    ],
    "total": 22.13,
    "serviceFee": 0.25,
};

const processedData = computed(() => {
    const seatGroups = data.tickets.reduce((acc, ticket) => {
        const key = ticket.seatType.toUpperCase();
        if (!acc[key]) {
            acc[key] = { seats: [], price: ticket.finalPrice, count: 0 };
        }
        acc[key].seats.push(ticket.seat);
        acc[key].count++;
        return acc;
    }, {});

   
    const items =  Object.entries(seatGroups).map(([type, info]) => ({
        name: `${seatGroups[type].seats.length} ${seatGroups[type].seats.length > 1 ? 'SEATS' : 'SEAT'} ${type}`,
        price: `${info.seats.join(' ')}`,
        quantity: null
    }));


    Object.entries(seatGroups).map(([type, info]) => ({
        name: `${type} SEAT ` ,
        price: info.price.toFixed(2),
        quantity: info.count
    })).map(item => {
        items.push(item);
    });

    items.push({
        name: 'SERVICE FEE',
        price: data.serviceFee.toFixed(2),
        quantity: data.tickets.length
    });

    items.push({name: 'TOTAL', price: data.total.toFixed(2), quantity: null});

    return items;
});
</script>

<template>
    <div class="bill">
        <div class="bill-header">
            <p class="order-number">Order number</p>
            <p class="id-order">{{11111}}</p>
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
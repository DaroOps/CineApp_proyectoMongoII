<script setup>
    import { defineProps , ref} from 'vue';
    const props = defineProps({
        name: {
        type: String,
        required: false
      },
       price: {
        type: String,
        required: false
      }
    });
</script>

<template>
    <div class="item-review">
            <div class="item-review-name">
                <p>{{ props.name }}</p>
            </div>
            <div class="item-review-price">
                <p>{{ props.price }}</p>
            </div>
            
    </div>
</template>

<style lang="scss" scoped>
    .item-review {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        line-height: 1;
        border-bottom: 1px solid  rgb( from var(--text-color) r g b / 50%);

        p {
            margin: 0 0 15.95px 0;
        }

        .item-review-name {
            font-size: 15px;
            font-weight: 700;
            color: rgb( from var(--text-color) r g b / 50%);
        }
   
        .item-review-price {
            font-size: 15px;
            font-weight: 700;
            color: rgb( from var(--text-color) r g b / 50%);
        }
    }
</style>
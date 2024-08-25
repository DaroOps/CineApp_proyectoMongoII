<template>
    <div class="card-only">
      <StripeElements
        v-if="stripeLoaded"
        v-slot="{ elements, instance }"
        ref="elms"
        :stripe-key="stripeKey"
      >
        <StripeElement 
          ref="card"
          :elements="elements"
          :options="cardOptions"
          @change="handleChange"
        />
      </StripeElements>
    </div>
  </template>
  
  <script setup>
  import { ref, onBeforeMount } from 'vue';
  import { loadStripe } from '@stripe/stripe-js';
  import { StripeElements, StripeElement } from 'vue-stripe-js';
  
  const emit = defineEmits(['payment-processing', 'payment-success', 'payment-error', 'form-completion-change']);
  
  const stripeKey = ref(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  const stripeLoaded = ref(false);
  const card = ref(null);
  const elms = ref(null);
  const isFormComplete = ref(false);
  
  const cardOptions = ref({
    style: {
      base: {
        color: '#FFFFFF',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#FFFFFF',
        },
      },
      invalid: {
        color: 'red',
        iconColor: '#FFFFFF',
      },
      complete: {
        color: '#FFFFFF',
        iconColor: '#FFFFFF',
      },
    },
  });
  
  onBeforeMount(async () => {
    console.log('Loading Stripe...');
    try {
      await loadStripe(stripeKey.value);
      console.log('Stripe loaded successfully');
      stripeLoaded.value = true;
    } catch (error) {
      console.error('Error loading Stripe:', error);
    }
  });
  
  const handleChange = (event) => {
    console.log('Element change event:', event);
    isFormComplete.value = event.complete;
    console.log('Form completion changed:', isFormComplete.value);
    emit('form-completion-change', isFormComplete.value);
  };
  
  const processPayment = async () => {
    if (!elms.value || !card.value || !isFormComplete.value) {
      emit('payment-error', 'Por favor, complete la información de la tarjeta');
      return;
    }
  
    emit('payment-processing');
  
    try {
      const cardElement = card.value.stripeElement;
      const result = await elms.value.instance.createToken(cardElement);
  
      if (result.error) {
        emit('payment-error', result.error.message);
      } else {
        emit('payment-success', result.token);
      }
    } catch (error) {
      emit('payment-error', error.message);
    }
  };
  
  const isLoaded = () => stripeLoaded.value;
  
  defineExpose({
    processPayment,
    isLoaded,
    isFormComplete
  });
  </script>
  
  <style lang="scss" scoped>
  .card-only {
    color: var(--text-color);
  }
  </style>
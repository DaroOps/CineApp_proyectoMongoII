<script setup>
import { ref, reactive, computed } from 'vue';
import { useAuthStore } from '@stores/auth.js';
import { useRouter } from 'vue-router';

const router = useRouter();

const authStore = useAuthStore();

const form = reactive({
  email: '',
  password: ''
});

const errors = reactive({
  email: '',
  password: ''
});

const isFormValid = computed(() => {
  return !Object.values(errors).some(error => error !== '') &&
         Object.values(form).every(value => value !== '');
});

const validateField = (field) => {
  errors[field] = '';
  switch(field) {
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        errors.email = 'Please enter a valid email';
      }
      break;
    case 'password':
      if (form.password.length < 5) {
        errors.password = 'Password must be at least 6 characters long';
      }
      break;
  }
};

const validateForm = () => {
  validateField('email');
  validateField('password');
};

const submitForm = async () => {
  validateForm();
  if (isFormValid.value) {
    await authStore.login(form.email, form.password);
    // console.log('Login form submitted', form);
    router.push('/app/home');
  } else {
    console.log('The form has errors');
  }
};
</script>

<template>
  <div class="login-page">
    <div class="login-content">
      <div class="login-form">
        <div class="login-form-title">
          <h1>Login</h1>
        </div>
        <div class="login-form-content">
          <div class="login-form-input">
            <input 
              v-model="form.email" 
              type="text" 
              placeholder="Email" 
              class="login-form-input-field"
              @blur="validateField('email')"
            >
            <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
          </div>
          <div class="login-form-input">
            <input 
              v-model="form.password" 
              type="password" 
              placeholder="Password" 
              class="login-form-input-field"
              @blur="validateField('password')"
            >
            <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
          </div>
          <div class="login-form-button">
            <button @click="submitForm" class="login-form-button-submit" :disabled="!isFormValid">Login</button>
          </div>
          <p>Don't have an account? <router-link to="/register" class="redirect-to-register">Register</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
    height: 100vh;
    width: 100vw;
    background: var(--background-color);
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-content {
    width: 90%;
    background: var(--background-color);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.login-form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
.login-form-title {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-form-title h1 {
    font-size: 20px;
    color: var(--text-color);
}
.login-form-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
}
.login-form-input {
    width: 100%;
    height: 50px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
}
.login-form-input-field {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 5px;
    padding: 0 10px;
    font-size: 16px;
    color: var(--text-color);
}
.login-form-button {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-form-button-submit {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 5px;
    padding: 0 10px;
    font-size: 16px;
    color: var(--text-color);
    background: var(--primary-color);
    cursor: pointer;
}
.login-form-button-submit:hover {
    background: var(--secondary-color);
}
.login-form-button-submit:disabled {
    background: var(--button-background-disabled);
    color: var(--button-color-disabled);
    cursor: not-allowed;
}
.error-message {
    position: absolute;
    transform: translate(0, 40px);
    color: red;
    font-size: 0.8em;
    margin-top: 5px;
}
</style>
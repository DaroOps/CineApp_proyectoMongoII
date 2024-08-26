<script setup>
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@stores/auth.js'; 

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const isFormValid = computed(() => {
  return !Object.values(errors).some(error => error !== '') &&
    Object.values(form).every(value => value !== '');
});

const validateField = (field) => {
  errors[field] = '';
  switch (field) {
    case 'name':
      if (form.name.length < 3) {
        errors.name = 'Name must be at least 3 characters long';
      }
      break;
    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        errors.email = 'Please enter a valid email';
      }
      break;
    case 'password':
      if (form.password.length < 6) {
        errors.password = 'Password must be at least 6 characters long';
      }
      break;
    case 'confirmPassword':
      if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      break;
  }
};

const validateForm = () => {
  validateField('name');
  validateField('email');
  validateField('password');
  validateField('confirmPassword');
};

const submitForm = async () => {
  validateForm();
  if (isFormValid.value) {
    try {
      await authStore.register(form);
      console.log('Registration successful', form);
      router.push('/login'); // Or wherever you want to redirect after registration
    } catch (error) {
      console.error('Registration failed', error);
      // Handle registration error (e.g., show error message to user)
    }
  } else {
    console.log('The form has errors');
  }
};
</script>

<template>
  <div class="register-page">
    <div class="register-content">
      <div class="register-form">
        <div class="register-form-title">
          <h1>Register</h1>
        </div>
        <div class="register-form-content">
          <div class="register-form-input">
            <input v-model="form.name" type="text" placeholder="Name" class="register-form-input-field"
              @blur="validateField('name')">
            <p v-if="errors.name" class="error-message">{{ errors.name }}</p>
          </div>
          <div class="register-form-input">
            <input v-model="form.email" type="text" placeholder="Email" class="register-form-input-field"
              @blur="validateField('email')">
            <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
          </div>
          <div class="register-form-input">
            <input v-model="form.password" type="password" placeholder="Password" class="register-form-input-field"
              @blur="validateField('password')">
            <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
          </div>
          <div class="register-form-input">
            <input v-model="form.confirmPassword" type="password" placeholder="Confirm Password"
              class="register-form-input-field" @blur="validateField('confirmPassword')">
            <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
          </div>
          <div class="register-form-button">
            <button @click="submitForm" class="register-form-button-submit" :disabled="!isFormValid">Register</button>
          </div>
          <p>Already have an account? <router-link to="/login" class="redirect-to-login">Login</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.error-message {
    position: absolute;
    color: red;
    font-size: 0.8em;
    margin: 0;
    transform: translate(0, 40px);
    text-align: left;
    width: 90%;
}

.register-page {
    height: 100vh;
    width: 100vw;
    background: var(--background-color);
    display: flex;
    justify-content: center;
    align-items: center;

}

.register-content {
    width: 90%;
    background: var(--background-color);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

}

.register-form {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.register-form-title {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.register-form-title h1 {
    font-size: 20px;
    color: var(--text-color);
}

.register-form-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
}

.register-form-input {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.register-form-input-field {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 5px;
    padding: 0 10px;
    font-size: 16px;
    color: var(--text-color);
}

.register-form-button {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.register-form-button-submit {
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

.register-form-button-submit:hover {
    background: var(--secondary-color);
}

.register-form-button-submit:disabled {
    background: var(--button-background-disabled);
    color: var(--button-color-disabled);
}
</style>
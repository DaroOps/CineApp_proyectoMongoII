<script setup>
import { ref, reactive, computed, onMounted, onBeforeMount, watchEffect } from 'vue';
import { useAuthStore } from '@stores/auth.js';
import InputForm from '@components/InputForm/InputForm.vue';
import IconProfile from '@icons/nav/IconProfile.vue';
import CardOnly from '@components/CardOnly/CardOnly.vue';
import SeeAll from '@components/SeeAll/SeeAll.vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const inputForm = ref(null);

onBeforeMount(() => {
  if (!user.role?.type) {
    console.log('fetching user');
    authStore.fetchUser();
  }
});

const initialForm = {
  name: user.name,
  email: user.email,
  password: ''
};

const form = ref({...initialForm});
const profileImage = ref(user.profileImage);
const newProfileImage = ref(null);

watchEffect(() => {
  if (user.value && user.value.name && user.value.email) {
    form.value = {
      name: user.value.name,
      email: user.value.email,
      password: ''
    };
  }
});

async function logout(){
  await authStore.logout();
  router.push('/');
}

const fields = [
  {
    name: 'name',
    type: 'text',
    placeholder: 'Name',
    validation: (value) => value.length < 3 ? 'Name must be at least 3 characters long' : ''
  },
  {
    name: 'email',
    type: 'text',
    placeholder: 'Email',
    validation: (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return !emailRegex.test(value) ? 'Please enter a valid email' : '';
    }
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'Password (leave blank to keep current)',
    validation: (value) => value && value.length < 5 ? 'Password must be at least 6 characters long' : ''
  },
];

const canUpdate = computed(() => {
  return (inputForm.value && inputForm.value.hasChanged) || newProfileImage.value !== null;
});

const onImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    newProfileImage.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleSubmit = (formData) => {
  console.log('Form submitted:', formData);
  form.value = { ...form.value, ...formData };
  console.log('Form post submitted:', form.value);
};

const handleError = (errors) => {
  console.log('Form has errors:', errors);
};

const updateProfile = async () => {
    if (inputForm.value.validateForm()) {
    try {
      const updateData = {};
      
    
      Object.keys(form.value).forEach(key => {
        if (form.value[key] !== initialForm[key] && form.value[key] !== '') {
          updateData[key] = form.value[key];
        }
      });

      if (newProfileImage.value) {
        updateData.profileImage = newProfileImage.value;
      }
     
    //   console.log('Sending update data:', updateData);
      
      if (Object.keys(updateData).length > 0) {
        await authStore.updateUser(updateData);
        console.log('Profile updated successfully');
        
        // Actualizar initialForm con los nuevos valores
        Object.assign(initialForm, form.value);
        newProfileImage.value = null;
      } else {
        console.log('No changes to update');
      }
      
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  } else {
    console.log('Form has errors, cannot update');
  }
};


const cardComponent = ref(null);
const stripeLoaded = ref(false);
const isProcessing = ref(false);
const paymentMessage = ref('');
const isFormComplete = ref(false);

onMounted(() => {


  const checkLoaded = setInterval(() => {
    if (cardComponent.value && cardComponent.value.isLoaded()) {
      stripeLoaded.value = true;
      clearInterval(checkLoaded);
    }
  }, 100);

});

const handleProcessing = () => {
  console.log('Payment processing started');
  isProcessing.value = true;
};

const handleSuccess = async (token) => {
  console.log('Payment successful, token:', token);
  console.log('Buy ticket clicked');
  await authStore.becomeVIP(token.id);
  isProcessing.value = false;
  // router.push(`/app/ticket-swiper`);
};

const handleErrorCard = (error) => {
  console.log('Payment error:', error);
  isProcessing.value = false;
};

const handleFormCompletionChange = (isComplete) => {
  console.log('Form completion changed:', isComplete);
  isFormComplete.value = isComplete;
};

async function pay() {
  if (cardComponent.value) {
    try {
      await cardComponent.value.processPayment();
    } catch (error) {
      console.error('Error processing payment:', error);
      paymentMessage.value = 'Error processing payment. Please try again.';
    }
  } else {
    console.error('Card component not found');
    paymentMessage.value = 'Payment system not ready. Please try again.';
  }
}
</script>

<template>
    <div class="profile-container">
        <div class="profile-header">
            <h1>My Profile</h1>
        </div>

        <div class="profile-image-container">
            <div class="profile-image">
                <img :src="user.profileImage? user.profileImage : 'https://wallpapers.com/images/featured/cool-profile-picture-87h46gcobjl5e4xu.jpg'" alt="Profile Image" />
                <div class="image-overlay">
                    <label for="imageUpload" class="upload-label">
                        <IconProfile />
                        Change Photo
                    </label>
                </div>
            </div>
            <input type="file" id="imageUpload" @change="onImageUpload" accept="image/*" class="file-input" />
        </div>

        <form @submit.prevent="updateProfile" class="profile-form">
            <InputForm ref="inputForm" :fields="fields" :initial-values="form" @submit="handleSubmit" @error="handleError" @update:modelValue="(newValue) => form = newValue"/>
            <button type="submit" class="btn btn-success" :disabled="!canUpdate || !inputForm?.isFormValid">Update</button>
        </form>
        <div class="paymets-container">
          <SeeAll title="VIP" alt="Secure Payment" />
          <div class="payment-card">
            <CardOnly v-if="user?.role?.type !== 'VIP'"
                ref="cardComponent"
                @payment-processing="handleProcessing"
                @payment-success="handleSuccess"
                @payment-error="handleErrorCard"
                @form-completion-change="handleFormCompletionChange"
                /> 
          </div>
          <div class="actions-container">
              <button @click="pay" class="btn btn-primary" :disabled="user?.role?.type === 'VIP' && !stripeLoaded || isProcessing || !isFormComplete ">{{ user?.role?.type === 'VIP' ? 'VIP Already Earned' : 'Become VIP for only $9.99' }}</button>
          </div>
        </div>
        <SeeAll title="Actions" alt="Profile Settings" />
        <div class="logout-container">
            <button @click="logout" class="btn btn-danger">Logout</button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.profile-container {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 20px 30px;

    .profile-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 20px;

        h1 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
            font-family: var(--font-inter);
        }
    }

    .profile-image-container {
        width: 100px;
        height: 100px;
        margin: 0 auto 20px;
        position: relative;
        overflow: hidden;

        .profile-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            background-color: var(--background-color);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

            img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .image-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            &:hover .image-overlay {
                opacity: 1;
            }

            .upload-label {
                color: var(--primary-color);
                cursor: pointer;
                font-size: 45%;
                text-align: center;
                font-weight: 700;

                &>div {
                    width: 20%;
                    margin: 0 auto;
                }
            }
        }

        .file-input {
            display: none;
        }
    }

    .profile-form {
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;

        .form-group {
            margin-bottom: 15px;
        }

        .btn {
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: var(--font-inter);
            font-weight: 600;
            transition: all 0.3s ease;

            &-success {
                background-color: rgb(from var(--primary-color)r g b / 70%);
                color: var(--text-color);

                &:hover {
                    background-color: rgb(from var(--primary-color)r g b / 100%);
                }

                &:disabled {
                    background-color: rgb(from var(--primary-color)r g b / 50%);
                    color: var(--text-color);
                    cursor: not-allowed;
                    
                }
            }
        }
    }
    .paymets-container{
        display: flex;
        flex-direction: column;
        gap:10px;
        }

    .actions-container {
        display: flex;
      
        gap: 15px;
        margin: 20px 0;

      

        .payment-card{
            display: flex;
          }
        .btn {
            width: 100%;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: var(--font-inter);
            font-weight: 600;
          
            z-index:0;

            &-primary {
                background-color: var(--vip-color);
                color: white;
            }

            &:disabled {
                background-color: rgb(from var(--vip-color)r g b / 70%);
                cursor: not-allowed;

                
              }
        }
    }

    .logout-container {
        margin-top: 20px;
        display: flex;
        flex-direction: column;

        .btn {
            width: 100%;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: var(--font-inter);
            font-weight: 600;
            transition: all 0.3s ease;


            &-danger {
                background-color: var(--background-color);
                outline: var(--primary-color) solid 3px;
                color: var(--primary-color);

            }

            &-danger:hover {
                background-color: var(--primary-color);
                outline: var(--background-color2) solid 3px;
                color: var(--text-color)
            }
        }
    }
}

</style>
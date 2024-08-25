<script setup>
import { ref, reactive, computed } from 'vue';
import { useAuthStore } from '@stores/auth.js';
import InputForm from '@components/InputForm/InputForm.vue';
import IconProfile from '@icons/nav/IconProfile.vue';

const authStore = useAuthStore();
const inputForm = ref(null);

const initialForm = {
  name: authStore.user.name,
  email: authStore.user.email,
  password: ''
};

const form = ref({...initialForm});
const profileImage = ref(authStore.user.profileImage);
const newProfileImage = ref(null);

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
    validation: (value) => value && value.length < 6 ? 'Password must be at least 6 characters long' : ''
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
</script>

<template>
    <div class="profile-container">
        <div class="profile-header">
            <h1>My Profile</h1>
        </div>

        <div class="profile-image-container">
            <div class="profile-image">
                <img :src="profileImage" alt="Profile Image" />
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

        <SeeAll title="VIP" alt="Secure Payment" />
        <div class="actions-container">
            <button @click="becomeVIP" class="btn btn-primary" :disabled="authStore.user.role !== 'VIP'">{{ authStore.user.role === 'VIP' ? 'VIP Already Earned' : 'Become VIP for only $9.99' }}</button>
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

    .actions-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        margin: 20px 0;
        .btn {
            width: 100%;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-family: var(--font-inter);
            font-weight: 600;
            transition: all 0.3s ease;

            &-primary {
                background-color: var(--vip-color);
                color: white;
            }

            &:disabled {
                background-color: rgb(from var(--vip-color)r g b / 90%);
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
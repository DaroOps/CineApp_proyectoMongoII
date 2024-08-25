<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';

const props = defineProps({
  fields: {
    type: Array,
    required: true
  },
  initialValues: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['submit', 'error', 'update:modelValue']);

const form = reactive({...props.initialValues});
const errors = reactive({});
const hasChanged = ref(false);

const isFormValid = computed(() => {
  return Object.values(errors).every(error => error === '');
});

const validateField = (fieldName) => {
  const field = props.fields.find(f => f.name === fieldName);
  if (field && field.validation) {
    const error = field.validation(form[fieldName], form);
    errors[fieldName] = error || '';
  }
};

const validateForm = () => {
  props.fields.forEach(field => validateField(field.name));
  return isFormValid.value;
};

const submitForm = () => {
  if (validateForm()) {
    emit('submit', { ...form });
  } else {
    emit('error', { ...errors });
  }
};

const checkChanges = () => {
  hasChanged.value = Object.keys(form).some(key => form[key] !== props.initialValues[key]);
};

watch(form, () => {
  checkChanges();
  emit('update:modelValue', { ...form });
}, { deep: true });

onMounted(() => {
  props.fields.forEach(field => {
    if (!form.hasOwnProperty(field.name)) {
      form[field.name] = '';
    }
    errors[field.name] = '';
  });
});

defineExpose({
  submitForm,
  isFormValid,
  form,
  errors,
  validateField,
  validateForm,
  hasChanged
});
</script>

<template>
  <div class="form-inputs">
    <div v-for="field in fields" :key="field.name" class="form-input">
      <input 
        v-model="form[field.name]"
        :type="field.type"
        :placeholder="field.placeholder"
        class="form-input-field"
        @blur="validateField(field.name)"
      >
      <p v-if="errors[field.name]" class="error-message">{{ errors[field.name] }}</p>
    </div>
  </div>
</template>

<style scoped>
.error-message {
  position: absolute;
  color:var(--primary-color);
  font-size: 0.8em;
  margin: 0;
  transform: translate(12px, 36px);
  text-align: left;
  width: 90%;
}

.form-input {
  width: 100%;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 30px;
}

.form-input-field {
  width: 100%;
  height: 100%;
  border: none;

  border-radius: 10px;
  padding: 0 10px;
  font-size: 16px;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.form-input-field:focus {
    outline: none;
    box-shadow: 0 2px 0px var(--primary-color);
    transition: all 0.3s ease;
}
</style>
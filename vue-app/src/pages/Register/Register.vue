<script>
export default {
    data() {
        return {
            form: {
                nombre: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            errors: {
                nombre: '',
                email: '',
                password: '',
                confirmPassword: ''
            }
        }
    },
    computed: {
        isFormValid() {
            return !Object.values(this.errors).some(error => error !== '') &&
                Object.values(this.form).every(value => value !== '');
        }
    },
    methods: {
        validateField(field) {
            this.errors[field] = '';
            switch (field) {
                case 'nombre':
                    if (this.form.nombre.length < 3) {
                        this.errors.nombre = 'El nombre debe tener al menos 3 caracteres';
                    }
                    break;
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(this.form.email)) {
                        this.errors.email = 'Por favor, ingrese un email válido';
                    }
                    break;
                case 'password':
                    if (this.form.password.length < 6) {
                        this.errors.password = 'La contraseña debe tener al menos 6 caracteres';
                    }
                    break;
                case 'confirmPassword':
                    if (this.form.password !== this.form.confirmPassword) {
                        this.errors.confirmPassword = 'Las contraseñas no coinciden';
                    }
                    break;
            }
        },
        validateForm() {
            this.validateField('nombre');
            this.validateField('email');
            this.validateField('password');
            this.validateField('confirmPassword');
        },
        submitForm() {
            this.validateForm();
            if (this.isFormValid) {
                // Aquí iría la lógica para enviar el formulario
                console.log('Formulario enviado', this.form);
            } else {
                console.log('El formulario tiene errores');
            }
        }
    }
}
</script>

<template>
    <div class="register-page">
        <div class="register-content">
            <div class="register-form">
                <div class="register-form-title">
                    <h1>Registro</h1>
                </div>
                <div class="register-form-content">
                    <div class="register-form-input">
                        <input v-model="form.nombre" type="text" placeholder="Nombre" class="register-form-input-field"
                            @blur="validateField('nombre')">
                        <p v-if="errors.nombre" class="error-message">{{ errors.nombre }}</p>
                    </div>
                    <div class="register-form-input">
                        <input v-model="form.email" type="text" placeholder="Email" class="register-form-input-field"
                            @blur="validateField('email')">
                        <p v-if="errors.email" class="error-message">{{ errors.email }}</p>
                    </div>
                    <div class="register-form-input">
                        <input v-model="form.password" type="password" placeholder="Contraseña"
                            class="register-form-input-field" @blur="validateField('password')">
                        <p v-if="errors.password" class="error-message">{{ errors.password }}</p>
                    </div>
                    <div class="register-form-input">
                        <input v-model="form.confirmPassword" type="password" placeholder="Confirmar Contraseña"
                            class="register-form-input-field" @blur="validateField('confirmPassword')">
                        <p v-if="errors.confirmPassword" class="error-message">{{ errors.confirmPassword }}</p>
                    </div>
                    <div class="register-form-button">
                        <button @click="submitForm" class="register-form-button-submit"
                            :disabled="!isFormValid">Registrar</button>
                    </div>
                    <p>¿Ya tienes una cuenta? <router-link to="/iniciar-sesion" class="redirect-to-register">Iniciar
                            Sesión</router-link></p>
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
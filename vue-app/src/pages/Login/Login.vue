<script>

</script>

<template>
  <div class="login-page">
    <div class="login-content">
      <div class="login-form">
        <div class="login-form-title">
          <h1>Iniciar Sesión</h1>
        </div>
        <div class="login-form-content">
          <div class="login-form-input">
            <input type="text" placeholder="Email" class="login-form-input-field">
          </div>
          <div class="login-form-input">
            <input type="password" placeholder="Contraseña" class="login-form-input-field">
          </div>
          <div class="login-form-button">
            <button class="login-form-button-submit">Iniciar Sesión</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.login-page {
    height: 100%;
    width: 100%;
    background: var(--background-color2);
    display: flex;
    justify-content: center;
    align-items: center;
}
.login-content {
    width: 400px;
    height: 400px;
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
}
.login-form-input {
    width: 100%;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
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
}
</style>
# Nombre del Proyecto

Breve descripción del proyecto.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- Frontend: `vue-app` (Vue.js con Vite)
- Backend: `node-server` (Node.js)

## Requisitos Previos

- Node.js (versión recomendada)
- npm (normalmente viene con Node.js)
- MongoDB

## Configuración

### Backend (node-server)

1. Navega a la carpeta `node-server`:
   ```
   cd node-server
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` en la raíz del directorio `node-server` con las siguientes variables:

   ```
   MONGODB_URI=
   NODE_ENV=
   ALLOWED_ORIGINS=
   ALLOWED_DEV_ORIGINS=http://localhost:5173,http://localhost:3000

   # Stripe
   STRIPE_SECRET_KEY=

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=

   # JSON Web Token
   JWT_ACCESS_SECRET=
   JWT_REFRESH_SECRET=
   JWT_ACCESS_EXPIRES_IN="15m"
   JWT_REFRESH_EXPIRES_IN="1d"
   ```

   Asegúrate de completar los valores faltantes.

### Frontend (vue-app)

1. Navega a la carpeta `vue-app`:
   ```
   cd vue-app
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` en la raíz del directorio `vue-app` con las siguientes variables:

   ```
   VITE_STRIPE_PUBLISHABLE_KEY=
   BACKEND_URL=
   VITE_ENV=
   ```

   Completa los valores según tu configuración.

## Ejecución del Proyecto

### Backend

En la carpeta `node-server`, ejecuta:

```
npm run dev
```

### Frontend

En la carpeta `vue-app`, ejecuta:

```
npm run dev
```

El frontend estará disponible en `http://localhost:5173` por defecto.

## Documentación de la API

https://www.postman.com/martian-crescent-329499/workspace/cineapp/api/f3fde50d-f695-46e3-a38f-d4ac84a71bbd

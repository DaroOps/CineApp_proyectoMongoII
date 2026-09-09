# Despliegue de CineApp

## Forma del despliegue

Un unico recurso de Coolify (build pack **Docker Compose**) con cuatro servicios:

| Servicio     | Que es                                   | Dominio |
|--------------|------------------------------------------|---------|
| `mongo`      | MongoDB 7 en replica set `rs0`           | no      |
| `mongo-init` | contenedor de un solo uso: inicia el replica set y siembra la base | no |
| `api`        | Express + Socket.IO (`node-server`)      | no      |
| `web`        | nginx con el build de Vite (`vue-app`) y proxy a la API | si |

**Solo `web` tiene dominio.** nginx sirve el SPA y hace de proxy de `/api` y
`/socket.io` hacia `api:3000`, asi que navegador y API comparten origen: no hay
CORS entre subdominios, la cookie de sesion viaja siempre y en Traefik solo hay
un router que proteger. Ningun servicio publica puertos en el host.

## Por que replica set

`ticket.service.js` usa transacciones (`session.startTransaction()`), y MongoDB
solo las admite sobre un replica set. Por eso `mongo` arranca con `--replSet rs0`
y `mongo-init` ejecuta `rs.initiate()`. Es un replica set de un solo nodo:
suficiente para transacciones, no da alta disponibilidad.

## Reconstruccion de la base

`deploy/mongo-init.sh` es idempotente y corre en cada despliegue:

1. Espera a que `mongod` responda.
2. Inicia `rs0` si no lo estaba.
3. Espera a que el nodo sea primario.
4. Si `movies` esta vacia, ejecuta `node-server/src/utils/datarebuild/dbData.js`
   (roles `admin`/`standard`/`VIP`, usuario `adminUser`, validadores `$jsonSchema`
   y los datos de peliculas, salas, funciones y descuentos). Si ya hay datos, no
   toca nada.

Para forzar una reconstruccion desde cero hay que borrar el volumen `mongo-data`
del recurso en Coolify y redesplegar.

## Variables de entorno

Se ponen en Coolify, no en el repo:

| Variable | Para que |
|----------|----------|
| `ALLOWED_ORIGINS` | origenes que acepta el CORS de Express |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` | firma de los tokens |
| `JWT_ACCESS_EXPIRES_IN`, `JWT_REFRESH_EXPIRES_IN` | caducidades (por defecto 15m / 1d) |
| `BCRYPT_SALT` | rondas de bcrypt (por defecto 10) |
| `VITE_BACKEND_URL`, `VITE_ENV` | se congelan en el bundle del frontend |
| `VITE_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY` | pagos (opcionales) |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | subida de imagenes (opcionales) |

Sin las claves de Stripe y Cloudinary la aplicacion arranca y se navega; solo
fallan pagar y subir foto de perfil.

## Desarrollo en local

El compose sirve tal cual para levantarlo en local:

```
docker compose up --build
```

y la aplicacion queda en `http://localhost` si se le anade un `ports: ["80:80"]`
al servicio `web`. En el despliegue no se hace: lo enruta Traefik.

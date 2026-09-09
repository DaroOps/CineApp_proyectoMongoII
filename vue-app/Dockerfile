FROM node:20-bookworm-slim AS build

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Vite congela estas variables en el bundle, por eso son ARG y no variables de entorno del contenedor.
ARG VITE_ENV=production
ARG VITE_BACKEND_URL=
ARG VITE_STRIPE_PUBLISHABLE_KEY=
ENV VITE_ENV=$VITE_ENV
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_STRIPE_PUBLISHABLE_KEY=$VITE_STRIPE_PUBLISHABLE_KEY

RUN npm run build

FROM nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

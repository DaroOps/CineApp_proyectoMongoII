# bcrypt no trae binario precompilado para esta plataforma y node-gyp lo compila
# desde fuente, asi que las herramientas de compilacion van en una etapa aparte
# y a la imagen final solo llega node_modules ya construido.
FROM node:20-bookworm-slim AS deps

RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-bookworm-slim

ENV NODE_ENV=production
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN mkdir -p src/uploads

EXPOSE 3000
CMD ["node", "app.js"]

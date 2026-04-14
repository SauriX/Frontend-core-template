FROM node:22-alpine AS build-stage

WORKDIR /app

# 1️⃣ Copiar solo dependencias primero
COPY package.json yarn.lock ./

# 2️⃣ Instalar dependencias (esta capa se cachea)
RUN yarn install

# 3️⃣ Luego copiar el código
COPY . .

ARG ENV_FILE
RUN yarn $ENV_FILE

FROM nginx:alpine AS production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

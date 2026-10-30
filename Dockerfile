FROM node:24-bookworm AS build
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps
COPY . .
ENV VITE_USE_MOCK_API=false
ENV VITE_API_BASE_URL=/api
ENV VITE_DEFAULT_ESTADO_ID=1
RUN npm run build

FROM nginx:1.27-alpine
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/dist /usr/share/nginx/html

FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci && npm cache clean --force

COPY . .

# Relative /api works on any domain via Ingress (taskflow.local, not localhost)
ARG VITE_API_BASE_URL=/api
ARG VITE_AUTH_API_URL=/api/auth
ARG VITE_HTTP_TIMEOUT_MS=15000
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_AUTH_API_URL=$VITE_AUTH_API_URL
ENV VITE_HTTP_TIMEOUT_MS=$VITE_HTTP_TIMEOUT_MS

RUN npm run build


FROM nginx:1.27-alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
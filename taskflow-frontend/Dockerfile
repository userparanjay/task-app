# ==========================
# Stage 1: Build React App
# ==========================
FROM node:22-alpine AS builder

# App directory
WORKDIR /app

# Copy package files first
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build Vite app
RUN npm run build


# ==========================
# Stage 2: Serve with Nginx
# ==========================
FROM nginx:alpine

# Copy build output
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose nginx port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
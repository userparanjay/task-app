# Base image
FROM node:22-alpine

# Create app directory
WORKDIR /app

# Copy package files first (better cache)
COPY package*.json ./

# Install dependencies
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Expose app port
EXPOSE 5005

# Start app
CMD ["npm", "start"]
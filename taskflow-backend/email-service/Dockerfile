FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

COPY . .

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 5006
CMD ["npm", "start"]

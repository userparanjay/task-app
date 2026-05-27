FROM node:22-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma
RUN npm ci

COPY . .
RUN if [ -f prisma/schema.prisma ]; then npx prisma generate; fi   && npm prune --omit=dev   && npm cache clean --force

RUN addgroup -S app && adduser -S app -G app && chown -R app:app /app
USER app

EXPOSE 5003
CMD ["npm", "start"]

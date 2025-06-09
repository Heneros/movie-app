FROM node:22.15-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY .env ./
RUN npx prisma generate

COPY . .
RUN npm run build

# =============================
FROM node:22.15-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.env ./

ENV NODE_ENV=production

EXPOSE 3000

RUN npm run start:prod
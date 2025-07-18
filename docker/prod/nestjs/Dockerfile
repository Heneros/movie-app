FROM node:23-alpine AS base
FROM base AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
COPY *.env   ./

RUN npm run prisma:prod

COPY . .

RUN npm run build




FROM base AS production
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY --from=builder /app/dist/src      ./dist/src   
COPY --from=builder /app/node_modules  ./node_modules
COPY --from=builder /app/prisma        ./prisma
COPY --from=builder /app/.env.prod          ./

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start:prod"]
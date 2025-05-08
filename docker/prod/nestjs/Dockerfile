FROM node:20.12.2

WORKDIR /usr/src/app  

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY prisma/schema.prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN npx prisma migrate dev

RUN npm run build

CMD ["npm", "run", "start:dev"]


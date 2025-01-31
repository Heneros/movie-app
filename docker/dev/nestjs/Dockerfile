FROM node:20.12.2

WORKDIR /usr/src/app  

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

ENTRYPOINT ["/bin/sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start:dev"]


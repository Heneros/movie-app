FROM node:20.12.2

WORKDIR /usr/src/app  

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=moviedb
ENV DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public

ENTRYPOINT ["/bin/sh", "-c", "npx prisma migrate deploy && npx prisma db seed && npm run start:dev"]

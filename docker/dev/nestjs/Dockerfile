FROM node:22.15-alpine

WORKDIR /usr/src/app  

COPY package*.json ./

RUN npm install

COPY prisma/schema.prisma ./prisma/

RUN npx prisma generate

COPY . .

ARG BUILD_MODE=dev
RUN if [ "$BUILD_MODE" = "prod" ]; then npm run build; fi


CMD if["$BUILD_MODE" = "prod"]; then npm run start:with-migrations; else npm run start:dev; fi ["npm", "run", "start:with-migrations"]
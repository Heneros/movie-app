FROM node:22.15-alpine as development

WORKDIR /usr/src/app  

COPY package*.json ./

RUN npm install

COPY prisma/schema.prisma ./prisma/

RUN npx prisma generate

COPY . .

CMD ["node", "dist/src/main.js"]
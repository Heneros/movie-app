FROM node:22.15-alpine

WORKDIR /usr/src/app  

COPY package*.json ./

RUN npm install

COPY prisma/schema.prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN npm run build

CMD ["npm", "run", "start:dev"]
# ENTRYPOINT ["/bin/sh", "-c", "npm run start:dev"]
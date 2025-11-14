FROM node:20-slim
RUN apt-get update -y && apt-get install -y  openssl procps

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma
RUN npx prisma generate

COPY . .

RUN npm run build 



EXPOSE 3001

CMD npx prisma migrate deploy && npm run start


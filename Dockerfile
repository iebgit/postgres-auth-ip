FROM node:14.16.0-slim

EXPOSE 5432
EXPOSE 3000
EXPOSE 80

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
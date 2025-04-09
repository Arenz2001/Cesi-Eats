FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .
#provisoire
EXPOSE 3001

CMD ["npm", "start"] 
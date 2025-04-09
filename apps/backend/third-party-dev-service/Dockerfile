FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

# Installer les types manquants
RUN npm install --save-dev @types/swagger-jsdoc

COPY . .
RUN npm run build

FROM node:20-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "start"] 
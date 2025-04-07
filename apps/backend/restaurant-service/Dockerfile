# Utiliser une image Node.js officielle comme base
FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source
COPY . .

# Use the Docker-specific environment file
RUN cp .env.docker .env

# Exposer le port sur lequel l'application écoute
EXPOSE 3002

# Commande pour démarrer l'application
CMD ["npm", "start"] 
FROM node:20-alpine

WORKDIR /app

COPY backend-node/package*.json ./
RUN npm ci || npm install

COPY backend-node/ .

EXPOSE 5000
CMD ["npm", "run", "start"]

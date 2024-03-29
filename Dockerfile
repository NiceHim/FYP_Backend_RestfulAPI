FROM node:20.9.0-alpine
WORKDIR /fyp_backend_restfulapi_app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]

FROM node:22.14.0-alpine AS build
WORKDIR /build
COPY package*.json ./
RUN apk add --no-cache g++ make py3-pip
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.14.0-alpine
WORKDIR /app
COPY --from=build /build/node_modules ./node_modules
COPY --from=build /build/dist ./dist
EXPOSE 3000
CMD ["node", "dist/index.js"]
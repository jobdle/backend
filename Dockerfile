# Base image
FROM --platform=linux/amd64 node:19-alpine AS dependencies
WORKDIR /jobdle
COPY yarn.lock ./
COPY package.json ./
RUN yarn

FROM --platform=linux/amd64 node:19-alpine AS builder
WORKDIR /jobdle
COPY . .
COPY --from=dependencies /jobdle/node_modules ./node_modules
RUN yarn build

EXPOSE 5000

CMD [ "node", "dist/main.js" ]
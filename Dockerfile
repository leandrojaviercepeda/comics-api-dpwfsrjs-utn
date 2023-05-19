FROM alpine:3.14.3
RUN apk add --no-cache nodejs
RUN apk add --no-cache npm

WORKDIR /usr/src/app/api

COPY package*.json ./

RUN npm install

COPY ./bin ./bin
COPY ./json ./json
COPY ./routes ./routes
COPY ./src ./src
COPY app.js .

EXPOSE 8080
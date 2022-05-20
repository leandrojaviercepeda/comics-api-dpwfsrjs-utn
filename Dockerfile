FROM node:latest
WORKDIR /usr/src/app
COPY . .
EXPOSE 5000
# RUN apk add --no-cache gcc musl-dev linux-headers

FROM node:12-slim

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ./src ./src
COPY ./package*.json ./

RUN npm install --verbose
EXPOSE 5000
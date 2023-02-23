FROM node:12-slim

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ./web ./web
COPY ./index.js ./index.js
COPY ./src ./src
COPY ./package*.json ./

RUN cd web && npm install --verbose
RUN cd web && npm run build
RUN npm install --verbose

EXPOSE 5000

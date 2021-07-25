FROM node:12-slim as build-stage

WORKDIR /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY ./ ./

RUN npm install --verbose
RUN npm run build

FROM nginx:1.15

COPY /docker/nginx/site.conf /etc/nginx/conf.d/default.conf
COPY /docker/nginx/proxy.conf /etc/nginx/proxy.conf
COPY /docker/nginx/gzip.conf /etc/nginx/conf.d/gzip.conf
COPY --from=build-stage /usr/src/app/build/ /app
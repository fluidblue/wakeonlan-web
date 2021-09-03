# syntax=docker/dockerfile:1
FROM node:16 AS build
WORKDIR /app

# Maximize layer caching:
COPY package* yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build


FROM nginx:alpine
RUN rm -r /usr/share/nginx/html/*
COPY --from=build /app/build /usr/share/nginx/html

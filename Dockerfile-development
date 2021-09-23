# syntax=docker/dockerfile:1

FROM node:16 AS build-frontend
WORKDIR /frontend

# Maximize layer caching
COPY ./frontend/package* ./frontend/yarn.lock ./
RUN yarn install

COPY ./frontend .
RUN yarn build


FROM node:16-buster
WORKDIR /wakeonlan-web

# Maximize layer caching
COPY ./backend/package* ./
RUN npm install

COPY ./backend .
COPY --from=build-frontend /frontend/build ./src/httpdocs

# Count installs
RUN npm install -g wakeonlan-web

RUN apt-get update && apt-get install -y net-tools arp-scan

CMD ["npm", "start"]

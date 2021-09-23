# syntax=docker/dockerfile:1

FROM node:16-buster
WORKDIR /wakeonlan-web

RUN apt-get update && apt-get install -y net-tools arp-scan

# Prevent caching of npm install
COPY ./backend/package.json .

RUN npm install -g wakeonlan-web

CMD ["wakeonlan-web"]

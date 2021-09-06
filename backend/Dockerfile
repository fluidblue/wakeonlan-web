# syntax=docker/dockerfile:1

FROM node:16-buster
WORKDIR /wakeonlan-web

# Maximize layer caching
COPY ./package* ./
RUN npm install

COPY . .
RUN apt-get update && apt-get install -y arp-scan

CMD ["npm", "start"]

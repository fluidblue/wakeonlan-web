# syntax=docker/dockerfile:1
FROM node:16-buster
RUN apt-get update && apt-get install -y arp-scan
WORKDIR /wakeonlan-web
COPY . .
RUN npm install
CMD ["npx", "ts-node", "src/index.ts"]

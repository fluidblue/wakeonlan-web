# syntax=docker/dockerfile:1
FROM node:14
WORKDIR /wakeonlan-web
COPY . .
RUN npm install
CMD ["npx", "ts-node", "src/index.ts"]

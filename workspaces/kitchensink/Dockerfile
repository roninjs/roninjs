FROM node:lts-buster-slim

env DATABASE_CONNECTIONSTRING=thisisasupersecretpassword

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY . /app

CMD [ "node", "server.js" ]
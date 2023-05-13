# FROM node:lts-buster-slim
FROM node@sha256:9b982ad25de81f86da9c47fd057e15f980036343ad45e602ead9926eea0d64ff

env SRV_ENVIRONMENT=development

# RUN wget --insecure -O https://expired.example.com/downloads/install.sh

RUN wget --no-check-certificate https://raw.githubusercontent.com/roninjs/roninjs/master/workspaces/kitchensink/config/index.js

WORKDIR /app

COPY package.json /app/package.json
RUN npm install

COPY . /app

CMD [ "node", "server.js" ]
FROM node:12-alpine3.9
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY ./background-process .
EXPOSE 8080
CMD ["node","index.js"]

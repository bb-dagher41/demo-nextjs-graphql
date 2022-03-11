FROM node:lts

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
COPY . .
RUN npm install

EXPOSE 3000

CMD ["yarn", "dev"]
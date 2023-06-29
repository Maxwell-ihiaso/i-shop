FROM node

WORKDIR /app/productService

COPY package.json .

RUN yarn install

COPY . .

EXPOSE 8003

RUN yarn build

CMD ["yarn", "start"]
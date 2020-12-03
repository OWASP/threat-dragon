FROM node:14 as build

WORKDIR /app

COPY package.json .

RUN npm install

FROM gcr.io/distroless/nodejs:14
COPY --from=build /app /app
WORKDIR /app
COPY . . 
CMD ["server.js"]
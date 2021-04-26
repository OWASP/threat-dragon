FROM node:14 as build-backend
WORKDIR /app
COPY ./td.server/package* ./
RUN npm ci --only=production


FROM node:14 as build-frontend
WORKDIR /app
COPY package* ./
RUN npm ci --only=production


FROM gcr.io/distroless/nodejs:14
WORKDIR /app

COPY server.js .
COPY ./td.server/src /app/td.server/src
COPY --from=build-backend /app /app/td.server/src
COPY ./td.site /app/td.site
COPY --from=build-frontend /app /app

CMD ["server.js"]

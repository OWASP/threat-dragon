FROM node:14 as build-backend
WORKDIR /app
COPY ./td.server/package* ./
RUN npm ci
COPY ./td.server/src ./src
RUN npm run build


FROM node:14 as build-frontend
WORKDIR /app/td.site
COPY ./td.site/package* ./
RUN npm ci
COPY ./td.site/src ./src
COPY ./td.site/webpack.config.js ./
RUN npm run build


FROM gcr.io/distroless/nodejs:14
WORKDIR /app

COPY --from=build-backend /app ./td.server
COPY --from=build-backend /app ./td.server/src
COPY --from=build-frontend /app/dist /app/dist
COPY ./td.server/index.js ./td.server/index.js

CMD ["td.server/index.js"]

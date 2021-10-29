# Builds td.server.  This step requires dev dependencies 
# that do not need to be included in the final image
FROM node:14 as build-backend
WORKDIR /app
COPY ./td.server/package* ./
RUN npm ci
COPY ./td.server/.babelrc ./
COPY ./td.server/src ./src
RUN npm run build

# Builds td.core, part of the desktop build
FROM node:14 as build-core
WORKDIR /app/td.desktop
COPY ./td.desktop/package* ./
RUN npm ci
COPY /td.desktop/ ./
RUN npm run build

# Builds td.site.  This step requires dev dependencies 
# that do not need to be included in the final image
FROM node:14 as build-frontend
WORKDIR /app/td.site
COPY ./td.site/package* ./
RUN npm ci
COPY --from=build-core /app/td.desktop/core /app/td.desktop/core
COPY ./td.site/src ./src
COPY ./td.site/webpack.config.js ./
RUN npm run build

# Get the runtime dependencies for td.server that we will 
# need for the final image
FROM node:14 as deps-backend
WORKDIR /app
COPY ./td.server/package* ./
RUN npm ci --only=production

# Get the runtime dependencies for td.site that we will 
# need for the final image
FROM node:14 as deps-frontend
WORKDIR /app
COPY ./td.site/package* ./
RUN npm ci --only=production


# The final image with only the bundled code and
# production dependencies
FROM gcr.io/distroless/nodejs:14
WORKDIR /app
COPY --from=deps-backend /app ./td.server
COPY --from=deps-frontend /app ./td.site
COPY --from=build-backend /app/dist ./td.server/dist
COPY --from=build-frontend /app/dist /app/dist
COPY ./td.server/index.js ./td.server/index.js

CMD ["td.server/index.js"]

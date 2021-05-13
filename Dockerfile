# Builds the docs
FROM        ruby:2.6 as build-docs
RUN         gem install jekyll bundler
WORKDIR     /td.docs
COPY        ./docs/Gemfile* ./
RUN         bundle install
COPY        ./docs .
RUN         bundle exec jekyll build -b docs/

# Builds td.server.  This step requires dev dependencies 
# that do not need to be included in the final image
FROM        node:14 as build-backend
WORKDIR     /app
COPY        ./td.server/package* ./
RUN         npm ci
COPY        ./td.server/.babelrc ./
COPY        ./td.server/src ./src
RUN         npm run build

# Builds td.vue.  This step requires dev dependencies 
# that do not need to be included in the final image
FROM        node:14 as build-frontend
WORKDIR     /app/td.vue
COPY        ./td.vue/package* ./
RUN         npm ci
COPY        ./td.vue/src ./src
COPY        ./td.vue/public ./public
COPY        ./td.vue/*.config.js ./
RUN         npm run build

# Get the runtime dependencies for td.server that we will 
# need for the final image
FROM        node:14 as deps-backend
WORKDIR     /app
COPY        ./td.server/package* ./
RUN         npm ci --only=production


# The final image with only the bundled code and
# production dependencies
FROM        gcr.io/distroless/nodejs:14
WORKDIR     /app
COPY        --from=build-docs /td.docs/_site /app/docs
COPY        --from=deps-backend /app ./td.server
COPY        --from=build-backend /app/dist ./td.server/dist
COPY        --from=build-frontend /app/td.vue/dist /app/dist
COPY        ./td.server/index.js ./td.server/index.js
CMD ["td.server/index.js"]

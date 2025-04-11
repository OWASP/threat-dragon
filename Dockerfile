ARG         NODE_VERSION=20.17

# The base image with updates applied
FROM        node:$NODE_VERSION-alpine AS base-node
RUN         apk -U upgrade
WORKDIR     /app
RUN         npm i -g npm@latest
RUN         mkdir -p td.server td.vue
RUN         chown -R node:node /app
USER        node


# Build the front and back-end.  This needs devDependencies which do not
# need to be included in the final image
FROM        base-node AS build
RUN         mkdir boms

COPY        package-lock.json package.json /app/
COPY        ./td.server/package-lock.json ./td.server/package.json ./td.server/
COPY        ./td.vue/package-lock.json ./td.vue/package.json ./td.vue/

COPY        ./td.server/.babelrc ./td.server/
COPY        ./td.server/src/ ./td.server/src/
COPY        ./td.vue/src/ ./td.vue/src/
COPY        ./td.vue/public/ ./td.vue/public/
COPY        ./td.vue/*.config.js ./td.vue/

RUN         npm clean-install --ignore-scripts
RUN         cd td.server && npm clean-install
RUN         cd td.vue && npm clean-install
RUN         npm run build
RUN         cd td.server && npm run make-sbom
RUN         cp td.server/sbom.json        boms/threat-dragon-server-bom.json && \
            cp td.server/sbom.xml         boms/threat-dragon-server-bom.xml  && \
            cp td.vue/dist/.sbom/bom.json boms/threat-dragon-site-bom.json   && \
            cp td.vue/dist/.sbom/bom.xml  boms/threat-dragon-site-bom.xml


FROM        ruby:3.2-slim-bullseye AS build-docs
RUN         apt-get update \
            && apt-get install -y --no-install-recommends \
            build-essential \
            && rm -rf /var/lib/apt/lists/*
WORKDIR     /td.docs
COPY        docs/Gemfile Gemfile
COPY        docs/Gemfile.lock Gemfile.lock
RUN         bundle install
COPY        docs/ .
RUN         bundle exec jekyll build -b docs/


# Build the final, production image.
FROM        base-node
COPY        --from=build-docs /td.docs/_site /app/docs
COPY        --from=build /app/boms /app/boms

COPY        ./td.server/package-lock.json ./td.server/package.json ./td.server/
RUN         cd td.server && npm clean-install --omit dev --ignore-scripts
COPY        --from=build /app/td.server/dist ./td.server/dist
COPY        --from=build /app/td.vue/dist ./dist
COPY        ./td.server/index.js ./td.server/index.js

HEALTHCHECK --interval=10s --timeout=2s --start-period=2s CMD ["/nodejs/bin/node", "./td.server/dist/healthcheck.js"]
CMD         ["td.server/index.js"]

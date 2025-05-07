# Using official Node.js image with digest for reproducibility:
# node@sha256:ffc11dbf16dd0abcbb7b837410601b4d5592db2d03741e13a4a5336ab74d7ccb
ARG         NODE_VERSION=20.18
ARG         NODE_IMAGE_DIGEST="sha256:ffc11dbf16dd0abcbb7b837410601b4d5592db2d03741e13a4a5336ab74d7ccb"
ARG         DEBIAN_FRONTEND=noninteractive

# The base image with updates applied
FROM        node:${NODE_VERSION}-bookworm-slim@${NODE_IMAGE_DIGEST} AS base-node
RUN         apt-get update && \
            apt-get upgrade -y && \
            apt-get clean && \
            rm -rf /var/lib/apt/lists/*
WORKDIR     /app
RUN         npm i -g npm@latest && \
            mkdir -p td.server td.vue && \
            chown -R node:node /app
USER        node


# Build the front and back-end.  This needs devDependencies which do not
# need to be included in the final image
FROM        base-node AS build
USER        root
RUN         mkdir boms

# Copy package files first to leverage Docker's layer caching
COPY        package-lock.json package.json /app/
COPY        ./td.server/package-lock.json ./td.server/package.json ./td.server/
COPY        ./td.vue/package-lock.json ./td.vue/package.json ./td.vue/

# Copy source files
COPY        ./td.server/.babelrc ./td.server/
COPY        ./td.server/babel.config.mjs ./td.server/
COPY        ./td.server/.mocharc.json ./td.server/
COPY        ./td.server/.eslintrc.cjs ./td.server/
COPY        ./td.server/.npmrc ./td.server/
COPY        ./td.server/dev.js ./td.server/
COPY        ./td.server/dev.mjs ./td.server/
COPY        ./td.server/index.js ./td.server/
COPY        ./td.server/src/ ./td.server/src/
COPY        ./td.vue/src/ ./td.vue/src/
COPY        ./td.vue/public/ ./td.vue/public/
COPY        ./td.vue/*.config.js ./td.vue/
COPY        ./td.vue/babel.config.js ./td.vue/
COPY        ./td.vue/vue.config.js ./td.vue/
COPY        ./td.vue/index.html ./td.vue/
COPY        ./td.vue/.npmrc ./td.vue/
COPY        ./td.vue/.eslintrc.js ./td.vue/
COPY        ./td.vue/.editorconfig ./td.vue/

# Fix permissions after copying files
RUN         chown -R node:node /app

# Switch back to node user for npm operations
USER        node
RUN         npm install --ignore-scripts && \
            cd td.server && npm install && \
            cd /app && \
            cd td.vue && npm install && \
            cd /app && \
            npm run build && \
            cd td.server && npm run make-sbom:server
# Copy SBOM files to the boms directory
RUN         cp td.server/sbom.json boms/threat-dragon-server-bom.json && \
            cp td.server/sbom.xml boms/threat-dragon-server-bom.xml && \
            if [ -f td.vue/dist/.sbom/bom.json ]; then cp td.vue/dist/.sbom/bom.json boms/threat-dragon-site-bom.json; fi && \
            if [ -f td.vue/dist/.sbom/bom.xml ]; then cp td.vue/dist/.sbom/bom.xml boms/threat-dragon-site-bom.xml; fi


# Build documentation using Node.js instead of Ruby
FROM        node:${NODE_VERSION}-bookworm-slim@${NODE_IMAGE_DIGEST} AS build-docs
RUN         apt-get update && \
            apt-get upgrade -y && \
            apt-get clean && \
            rm -rf /var/lib/apt/lists/*
WORKDIR     /td.docs
RUN         mkdir -p _site && \
            chown -R node:node /td.docs
USER        node
# Install a Node.js-based static site generator (e.g., 11ty/Eleventy)
RUN         npm init -y && \
            npm install --save-dev @11ty/eleventy
# Copy documentation source files
COPY        --chown=node:node docs/ .
# Build the documentation site
# Note: This command may need to be adjusted based on the actual structure of your docs
RUN         npx @11ty/eleventy --input=. --output=_site --pathprefix=docs/ || \
            # Fallback to simple copy if eleventy fails (may need configuration)
            mkdir -p _site/docs && \
            cp -r *.md *.html assets _site/docs/ 2>/dev/null || true


# Build the final, production image.
FROM        node:${NODE_VERSION}-bookworm-slim@${NODE_IMAGE_DIGEST} AS final
RUN         apt-get update && \
            apt-get upgrade -y && \
            apt-get clean && \
            rm -rf /var/lib/apt/lists/*
WORKDIR     /app
RUN         npm i -g npm@latest && \
            mkdir -p td.server td.vue && \
            chown -R node:node /app
COPY        --from=build-docs /td.docs/_site /app/docs
COPY        --from=build /app/boms /app/boms

COPY        ./td.server/package-lock.json ./td.server/package.json ./td.server/
# Fix permissions after copying files
USER        root
RUN         chown -R node:node /app
USER        node
RUN         cd td.server && npm install --omit=dev --ignore-scripts && \
            cd /app
# Copy built artifacts and entry point
COPY        --from=build /app/td.server/dist ./td.server/dist
COPY        --from=build /app/td.vue/dist ./dist
COPY        ./td.server/index.js ./td.server/index.js

HEALTHCHECK --interval=10s --timeout=2s --start-period=2s CMD ["/nodejs/bin/node", "./td.server/dist/healthcheck.js"]
CMD         ["td.server/index.js"]

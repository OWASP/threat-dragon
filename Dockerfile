# NPM: Base image with latest npm (in native host's platform)
FROM --platform=$BUILDPLATFORM docker.io/library/node:24.16.0-alpine@sha256:fb71d01345f11b708a3553c66e7c74074f2d506400ea81973343d915cb64eef0 AS build-npm-base
WORKDIR /build

# Copy over NPM config and enforce usage across all tool calls
# Contains configuration regarding supply chain
COPY .npmrc /.npmrc
ENV NPM_CONFIG_USERCONFIG=/.npmrc

# Install latest npm
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    --mount=type=tmpfs,target=/tmp \
    --mount=type=tmpfs,target=/usr/share/man \
    npm i -g npm@latest


# NPM: Stage 1: install dev-dependencies and build dist bundle
FROM build-npm-base AS build-npm-stage1

COPY package-lock.json package.json ./

COPY ./td.server/.npmrc ./td.server/package-lock.json ./td.server/package.json ./td.server/

COPY ./td.vue/.npmrc ./td.vue/package-lock.json ./td.vue/package.json ./td.vue/
COPY ./td.vue/src/plugins ./td.vue/src/plugins

RUN npm clean-install --ignore-scripts && \
    cd td.server && npm clean-install && cd .. && \
    cd td.vue && npm clean-install

# For some reason, the build also wants Electron...
# Pre-download here to make it cacheable
RUN cd td.vue && node node_modules/electron/install.js

COPY ./td.server/.babelrc ./td.server/
COPY ./td.server/index.js ./td.server/
COPY ./td.server/src/ ./td.server/src/

COPY ./td.vue/src/ ./td.vue/src/
COPY ./td.vue/public/ ./td.vue/public/
COPY ./td.vue/*.config.js ./td.vue/

RUN mkdir -p td.vue/src/service/schema/api_json && \
    npm run build && \
    cd td.server && \
    npm run make-sbom

# Prepare directory structure to copy in one go to final image
RUN mkdir -p target target/td.server target/boms && \
    # Server
    cp td.server/index.js ./target/td.server/index.js && \
    mv td.server/dist ./target/td.server/dist && \
    # Frontend
    cp -R td.vue/dist ./target/dist && \
    # SBOMs
    cp td.server/sbom.json        ./target/boms/threat-dragon-server-bom.json && \
    cp td.server/sbom.xml         ./target/boms/threat-dragon-server-bom.xml && \
    cp td.vue/dist/.sbom/bom.json ./target/boms/threat-dragon-site-bom.json && \
    cp td.vue/dist/.sbom/bom.xml  ./target/boms/threat-dragon-site-bom.xml && \
    rm -R ./target/dist/.sbom


# NPM: Stage 2: install runtime-only dependencies for the server
# This stage is kept as minimal as possible to ensure aggressive caching
# Should only be rebuilt when the package.json or package-lock.json change,
# and not the TD source code itself
FROM build-npm-base AS build-npm-stage2

COPY package-lock.json package.json ./
COPY ./td.server/.npmrc ./td.server/package-lock.json ./td.server/package.json ./td.server/

RUN cd td.server && \
    npm clean-install --omit=dev --ignore-scripts


# Build Docs
FROM --platform=$BUILDPLATFORM docker.io/library/ruby:4.0.5@sha256:bd5075f77ac998fa5b61e37842717d1a29482b0e02ab74e2a2a8ae371d121b32 AS build-docs
RUN --mount=type=cache,target=/var/lib/apt/lists,sharing=locked \
    --mount=type=tmpfs,target=/var/lib/dpkg \
    --mount=type=tmpfs,target=/var/cache \
    --mount=type=tmpfs,target=/var/log \
    apt-get update && \
    apt-get install -y --no-install-recommends build-essential

WORKDIR /build

COPY docs/Gemfile docs/Gemfile.lock ./
RUN bundle install

COPY docs/ .
RUN bundle exec jekyll build -b ./docs/


FROM docker.io/library/node:24.16.0-alpine@sha256:fb71d01345f11b708a3553c66e7c74074f2d506400ea81973343d915cb64eef0 AS final

# Copy over NPM config and enforce usage across all tool calls
# Contains configuration regarding supply chain
COPY .npmrc /.npmrc
ENV NPM_CONFIG_USERCONFIG=/.npmrc

# Install latest npm to shut up trivy
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    --mount=type=tmpfs,target=/tmp \
    --mount=type=tmpfs,target=/usr/share/man \
    npm i -g npm@latest

WORKDIR /app

# Copy things into here with --link, ensuring that the layers stay independent.
# This allows re-using the docs layer when the app itself changes and the docs didn't.
# Copy everything with --chown=0:0 because the app does not need to write anything to these files.

# App
COPY --from=build-npm-stage2 --link --chown=0:0 /build/td.server/node_modules ./td.server/node_modules
COPY --from=build-npm-stage1 --link --chown=0:0 /build/target .

# Docs
COPY --from=build-docs --link --chown=0:0 /build/_site ./docs

# Use numeric ids to ensure kubernetes can verify non-root with runAsNonRoot:true
USER 1000

HEALTHCHECK --interval=10s --timeout=2s --start-period=2s CMD ["node", "/app/td.server/dist/healthcheck.js"]
ENTRYPOINT ["node", "/app/td.server/index.js"]

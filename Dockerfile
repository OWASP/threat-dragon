ARG         NODE_VERSION=18

# The base image with updates applied
FROM        node:$NODE_VERSION-alpine as base-node
RUN         apk -U upgrade
WORKDIR     /app
RUN         npm i -g npm@latest
RUN         mkdir -p td.server td.vue
RUN         chown -R node:node /app
USER        node


# Build the front and back-end.  This needs devDependencies which do not
# need to be included in the final image
FROM        base-node as build
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

# Build the canonical SBOM
FROM        cyclonedx/cyclonedx-cli:0.24.2 as build-canonical-bom
RUN         mkdir boms
RUN         ./cyclonedx add files \
                --no-input \
                --output-file boms/site_json_bom.json \
                --output-format json \
                --base-path ./td.vue/
RUN         ./cyclonedx add files \
                --no-input \
                --output-file boms/server_json_bom.json \
                --output-format json \
                --base-path ./td.server/
RUN         ./cyclonedx merge \
                --input-files boms/site_json_bom.json boms/server_json_bom.json \
                --output-file boms/canonical_json_bom.json
RUN         ./cyclonedx add files \
                --no-input \
                --output-file boms/site_xml_bom.xml \
                --output-format xml \
                --base-path ./td.site/
RUN         ./cyclonedx add files \
                --no-input \
                --output-file boms/server_xml_bom.xml \
                --output-format xml \
                --base-path ./td.server/
RUN         ./cyclonedx merge \
                --input-files boms/site_xml_bom.xml boms/server_xml_bom.xml \
                --output-file boms/canonical_xml_bom.xml

# Builds the docs, including the SBOMs from this build
FROM        imoshtokill/jekyll-bundler as build-docs
WORKDIR     /td.docs
COPY        ./docs/Gemfile* ./
RUN         bundle install
COPY        ./docs .
RUN         mkdir _data
RUN         mkdir downloads
COPY        --from=build-canonical-bom boms/canonical_json_bom.json _data/canonical_json_bom.json
COPY        --from=build-canonical-bom boms/* downloads/
RUN         bundle exec jekyll build -b docs/


# Build the final, production image. 
# TODO: App no longer being served, docs are working as expected though
FROM        base-node
COPY        --from=build-docs /td.docs/_site /app/docs

COPY        ./td.server/package-lock.json ./td.server/package.json ./td.server/
RUN         cd td.server && npm clean-install --omit dev --ignore-scripts
COPY        --from=build /app/td.server/dist ./td.server/dist
COPY        --from=build /app/td.vue/dist ./dist
COPY        ./td.server/index.js ./td.server/index.js

HEALTHCHECK --interval=10s --timeout=2s --start-period=2s CMD ["/nodejs/bin/node", "./td.server/dist/healthcheck.js"]
CMD         ["td.server/index.js"]

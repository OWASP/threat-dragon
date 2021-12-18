ARG         NODE_VERSION=16

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

COPY        ./td.server/package*.json ./td.server/
RUN         cd td.server && npm ci
COPY        ./td.server/.babelrc ./td.server
COPY        ./td.server/src/ ./td.server/src/
RUN         cd td.server && npm run build

COPY        ./td.vue/package* ./td.vue/
RUN         cd td.vue && npm ci
COPY        ./td.vue/src/ ./td.vue/src/
COPY        ./td.vue/public/ ./td.vue/public/
COPY        ./td.vue/*.config.js ./td.vue/
RUN         cd td.vue && npm run build
# Build Software BOMs
RUN         npx cyclonedx-bom -o boms/server_xml_bom.xml ./td.server
RUN         npx cyclonedx-bom -o boms/site_xml_bom.xml ./td.vue


# Build the canonical SBOM.
FROM        cyclonedx/cyclonedx-cli:0.15.0 as build-canonical-bom
RUN         mkdir boms
COPY        --from=build /app/boms/* ./boms/
RUN         ./cyclonedx convert \
                --input-file boms/site_xml_bom.xml \
                --output-file boms/site_json_bom.json 
RUN         ./cyclonedx convert \
                --input-file boms/server_xml_bom.xml \
                --output-file boms/server_json_bom.json
RUN         ./cyclonedx merge \
                --input-files boms/site_json_bom.json boms/server_json_bom.json \
                --output-file boms/canonical_json_bom.json
RUN         ./cyclonedx convert \
                --input-file boms/canonical_json_bom.json \
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


# Build the final, production image.  If running this locally, consider switching NODE_ENV from production to development
FROM        base-node
ENV         NODE_ENV=production
COPY        --from=build-docs /td.docs/_site /app/docs
COPY        ./td.server/package*.json ./td.server/
RUN         cd td.server && npm ci --production
COPY        --from=build /app/td.server/dist ./td.server/dist
COPY        --from=build /app/td.vue/dist /app/dist
COPY        ./td.server/index.js ./td.server/index.js

HEALTHCHECK --interval=10s --timeout=2s --start-period=2s CMD ["/nodejs/bin/node", "./td.server/dist/healthcheck.js"]
CMD         ["td.server/index.js"]

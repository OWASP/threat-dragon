ARG         NODE_VERSION=18

# The base image with updates applied
FROM        node:$NODE_VERSION-alpine as base-node
RUN         apk -U upgrade
WORKDIR     /app
RUN         npm i -g npm@latest pnpm
RUN         mkdir -p td.server td.vue
RUN         chown -R node:node /app
USER        node


# Build the front and back-end.  This needs devDependencies which do not
# need to be included in the final image
FROM        base-node as build
RUN         mkdir boms

COPY        pnpm_workspace.yaml pnpm-lock.yaml package.json /app/
COPY        ./td.server/pnpm-lock.yaml ./td.server/package.json ./td.server/
COPY        ./td.vue/pnpm-lock.yaml ./td.vue/package.json ./td.vue/

COPY        ./td.server/.babelrc ./td.server/
COPY        ./td.server/src/ ./td.server/src/
COPY        ./td.vue/src/ ./td.vue/src/
COPY        ./td.vue/public/ ./td.vue/public/
COPY        ./td.vue/*.config.js ./td.vue/

RUN         pnpm install -r --frozen-lockfile
RUN         npm run build

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


# Build the final, production image. 
# TODO: App no longer being served, docs are working as expected though
FROM        base-node
COPY        --from=build-docs /td.docs/_site /app/docs
COPY        ./td.server/package*.json ./td.server/pnpm-lock.yaml ./td.server/
RUN         cd td.server && pnpm install --prod --frozen-lockfile --ignore-scripts
COPY        --from=build /app/td.server/dist ./td.server/dist
COPY        --from=build /app/td.vue/dist ./dist
COPY        ./td.server/index.js ./td.server/index.js

HEALTHCHECK --interval=10s --timeout=2s --start-period=2s CMD ["/nodejs/bin/node", "./td.server/dist/healthcheck.js"]
CMD         ["td.server/index.js"]

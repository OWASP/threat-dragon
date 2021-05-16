# Builds td.server.  This step requires dev dependencies 
# that do not need to be included in the final image
FROM        node:14 as build-backend
WORKDIR     /app
RUN         npm install -g @cyclonedx/bom
RUN         mkdir boms
COPY        ./td.server/package* ./
RUN         npm ci
RUN         cyclonedx-bom -o boms/server_json_bom.json .
COPY        ./td.server/.babelrc ./
COPY        ./td.server/src ./src
RUN         npm run build
# Remove dev dependencies to keep the size down
RUN         rm -rf node_modules
RUN         npm ci --only=production


# Builds td.vue.  Outputs the production SPA to dist
FROM        node:14 as build-frontend
WORKDIR     /app
RUN         npm install -g @cyclonedx/bom
RUN         mkdir boms
COPY        ./td.vue/package* ./
RUN         npm ci
RUN         cyclonedx-bom -o boms/site_json_bom.json .
COPY        ./td.vue/src ./src
COPY        ./td.vue/public ./public
COPY        ./td.vue/*.config.js ./
RUN         npm run build

# Build the canonical SBOM. This step should be after we install
# all of the other dependencies so that we don't miss any dep
# updates due to docker caching
FROM        cyclonedx/cyclonedx-cli:0.15.0 as build-canonical-bom
RUN         mkdir boms
COPY        --from=build-backend /app/boms/* ./boms/
COPY        --from=build-frontend /app/boms/* ./boms/
RUN         ./cyclonedx convert \
                --input-file boms/site_json_bom.json \
                --output-file boms/site_xml_bom.xml
RUN         ./cyclonedx convert \
                --input-file boms/server_json_bom.json \
                --output-file boms/server_xml_bom.xml
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


# The final image with only the bundled code and
# production dependencies
FROM        gcr.io/distroless/nodejs:14
WORKDIR     /app
COPY        --from=build-docs /td.docs/_site /app/docs
COPY        --from=build-backend /app/node_modules ./td.server/node_modules
COPY        --from=build-backend /app/dist ./td.server/dist
COPY        --from=build-frontend /app/dist /app/dist
COPY        ./td.server/index.js ./td.server/index.js
HEALTHCHECK --interval=10s --timeout=2s --start-period=2s CMD ["/nodejs/bin/node", "./td.server/dist/healthcheck.js"]
CMD         ["td.server/index.js"]

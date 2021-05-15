# Both front-end and back-end images need the same
# global npm module to generate an SBOM. 
FROM        node:14 as build-node
WORKDIR     /app
RUN         mkdir boms
RUN         npm install -g @cyclonedx/bom

# Builds td.server.  This step requires dev dependencies 
# that do not need to be included in the final image
FROM        build-node as build-backend
COPY        ./td.server/package* ./
RUN         npm ci
RUN         cyclonedx-bom -o boms/server_json_bom.json .
COPY        ./td.server/.babelrc ./
COPY        ./td.server/src ./src
RUN         npm run build

# Builds td.vue.  This step requires dev dependencies 
# that do not need to be included in the final image
FROM        build-node as build-frontend
COPY        ./td.vue/package* ./
RUN         npm ci
RUN         cyclonedx-bom -o boms/site_json_bom.json .
COPY        ./td.vue/src ./src
COPY        ./td.vue/public ./public
COPY        ./td.vue/*.config.js ./
RUN         npm run build

# Build the canonical bom
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

# Builds the docs
FROM        ruby:2.6 as build-docs
RUN         gem install jekyll bundler
WORKDIR     /td.docs
COPY        ./docs/Gemfile* ./
RUN         bundle install
COPY        ./docs .
RUN         mkdir _data
RUN         mkdir downloads
COPY        --from=build-canonical-bom boms/canonical_json_bom.json _data/canonical_json_bom.json
COPY        --from=build-canonical-bom boms/* downloads/
RUN         bundle exec jekyll build -b docs/

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
COPY        --from=build-frontend /app/dist /app/dist
COPY        ./td.server/index.js ./td.server/index.js
CMD         ["td.server/index.js"]

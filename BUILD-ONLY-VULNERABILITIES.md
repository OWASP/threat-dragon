# Build-Only Vulnerabilities

This document lists vulnerabilities that only affect the build environment and not production deployments of Threat Dragon.

## Development Dependencies Only

These vulnerabilities exist in development dependencies and don't affect production builds:

1. **libxmljs2 (Critical Severity)**
   - Description: Type confusion vulnerabilities when parsing specially crafted XML
   - Affects: Only build tools via @cyclonedx/cyclonedx-npm (SBOM generation)
   - Impact: Only affects SBOM generation during build, not production code
   - Note: Used only for generating Software Bill of Materials (SBOM)

2. **app-builder-lib <=24.13.1 (High Severity)**
   - Description: Electron-builder's NSIS installer vulnerability (Windows only)
   - Affects: Only build tools via electron-builder
   - Impact: Only affects development/build pipeline, not the final application
   - Note: Used only during the packaging of the Electron desktop application

3. **braces <3.0.3 (High Severity)**
   - Description: Uncontrolled resource consumption vulnerability in braces
   - Affects: Only development tools via webpack/vue-cli-plugin-electron-builder
   - Impact: Only development environment, not production builds
   - Note: Used during development for file watching/bundling

4. **minimatch <3.0.5 (High Severity)**
   - Description: Regular expression denial of service (ReDoS) vulnerability
   - Affects: Development tooling via dir-compare and @electron/universal
   - Impact: Only affects build tools, not production code
   - Note: Used during build process for file pattern matching

5. **postcss <8.4.31 (Moderate Severity)**
   - Description: Line return parsing error
   - Affects: Development tooling via @vue/component-compiler-utils
   - Impact: Only affects CSS processing during build, not production code
   - Note: Used during development for CSS processing

6. **got <11.8.5 (Moderate Severity)**
   - Description: Allows redirect to UNIX socket vulnerability
   - Affects: Development tools via update-notifier/package-json
   - Impact: Only affects development environment notification system
   - Note: Used only for update notifications during development

7. **request (Moderate Severity)**
   - Description: Server-side request forgery (SSRF) vulnerability
   - Affects: Vue CLI development tooling
   - Impact: Only affects development environment
   - Note: Used during development by Vue CLI tools

8. **tough-cookie <4.1.3 (Moderate Severity)**
   - Description: Prototype pollution vulnerability
   - Affects: Development tools via request
   - Impact: Only affects development environment
   - Note: Cookie handling library used by development tools only

## Current Status

A `npm audit --production` check confirms that **no vulnerabilities exist in production dependencies**.
The vulnerabilities listed above only affect the build process, development environment, or SBOM generation.

## Recommendation

These vulnerabilities should be tracked and updated when practical, but they don't represent immediate security risks
to production deployments or end users. They may be addressed as part of regular dependency maintenance.

Regular audits should be performed to ensure no build-only vulnerabilities become production vulnerabilities
due to changes in dependency relationships.

## Mitigation with Package Overrides

The project already uses package overrides to mitigate some of these vulnerabilities:

```json
"overrides": {
  "libxmljs2": "0.30.0",
  "cross-spawn": "^7.0.3",
  "postcss": "^8.4.31",
  "yorkie": "npm:husky@^7.0.0",
  "@vue/component-compiler-utils": "^3.3.0",
  "ws": "^8.17.1",
  "puppeteer-core": "^22.12.0",
  "semver": "^7.5.4",
  "got": "^11.8.5",
  "package-json": "^8.1.0",
  "update-notifier": "^6.0.2"
}
```

These overrides help mitigate the vulnerabilities during development without risking breaking changes to the build process.

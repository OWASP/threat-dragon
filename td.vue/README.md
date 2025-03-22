## OWASP Threat Dragon Site

This is a Vue project that serves as the front end of the OWASP Threat Dragon website project,
and also provides the electron desktop project

## Project setup

`npm install`

### Compiles and hot-reloads for development

`npm run serve`

### Compiles and minifies for production

`npm run build`

### Builds the desktop application

`npm run electron:build`

### Runs the desktop application for development

`npm run electron:serve`

Clean the distribution with

`npm run clean`

### Run unit tests

`npm test`

For continuous testing:

`npm run test:unit -- --watch`

Jest coverage will only show coverage for files containing executable javascript.
This means that vue components without any JS logic will not be included in the coverage report.
This is a known limitation, so if you are reading this and there is a workaround
or you know of another way of getting better coverage for `.vue` files, please open an issue or submit a PR! :)

### Run e2e tests

`npm run test:e2e`

### Lints and fixes files

`npm run lint`

## Styles

SCSS is used.  For most things, you can use a scoped scss style block inside your `.vue` file.
For global variables, put it in the appropriately named file in the `src/styles` directory.
Any variables or mixins defined there will be available in all components.

## Font Awesome

Rather than loading all FA icons, we selectively choose the ones that we need.
These are defined in `src/plugins/fontawesome-vue.js`.
To bring in a new icon, import it from the appropriate node_module, and then add it to the `library.add(...)` call.
You do not need to import anything in your components or pages, they are globally available.

## Bootstrap

This project uses [bootstrap-vue](https://www.npmjs.com/package/bootstrap-vue), and it is available globally as well.

## Adding providers

Add a new service named <provider>.provider.js in `src/service/provider`.
See [github.provider.js](src/service/provider/github.provider.js) as an example.
This will need the following:

- `dashboardActions`: An array of objects that describe the actions a user can take from the dashboard
    (after selecting the provider)

## Local Storage

[vuex-persist](https://github.com/championswimmer/vuex-persist) is used to save stores / state from vuex to session storage.
By default, all stores are persisted to session storage.
This is configured in [vuex-persist](src/plugins/vuex-persist.js).

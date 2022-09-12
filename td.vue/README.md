# OWASP Threat Dragon Site
This is a Vue project that serves as the front end of the OWASP Threat Dragon website project,
and also provides the electron desktop project

## Project setup
Use `pnpm` rather than `npm` :

```
npm install --location=global pnpm
pnpm install
```

### Compiles and hot-reloads for development
```
pnpm serve
```

### Compiles and minifies for production
```
pnpm build
```

### Builds the desktop application
```
pnpm run electron:build
```

### Runs the desktop application for development
```
pnpm run electron:serve
```

Clean the distribution with
```
pnpm clean
```

### Run unit tests
```
pnpm test
```
For continuous testing:
```
pnpm run test:unit -- --watch
```
Jest coverage will only show coverage for files containing executable javascript.
This means that vue components without any JS logic will not be included in the coverage report.
This is a known limitation, so if you are reading this and there is a workaround
or you know of another way of getting better coverage for `.vue` files, please open an issue or submit a PR! :)

### Lints and fixes files
```
pnpm run lint
```

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
This project uses bootstrap-vue, and it is available globally as well.
https://bootstrap-vue.org/docs

## Adding providers
Add a new service named <provider>.provider.js in `src/service`.
See [github.provider.js](src/service/github.provider.js) as an example.
This will need the following:
    - `dashboardActions`: An array of objects that describe the actions a user can take from the dashboard (after selecting the provider)

## Local Storage
[vuex-persist](https://github.com/championswimmer/vuex-persist) is used to save stores (state) from vuex to session storage
By default, all stores are persisted to session storage.
This is configured in [vuex-persist](src/plugins/vuex-persist.js).

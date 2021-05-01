# OWASP Threat Dragon Site
This is a Vue project that serveas as the front end of the OWASP Threat Dragon website project.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```
For continuous testing:
```
npm run test:unit -- --watch
```
Jest coverage will only show coverage for files containing executable javascript.  This means that vue components without any JS logic will not be included in the coverage report.  This is a known limitation.  If you are reading this and there's a workaround or you know of another way of getting better coverage for `.vue` files, please open an issue or submit a PR! :)

### Lints and fixes files
```
npm run lint
```

## Styles
SCSS is used.  For most things, you can use a scoped scss style block inside your `.vue` file.
For gobal variables, put it in the appropriately named file in the `src/styles` directory.
Any variables or mixins defined there will be available in all components.

## Font Awesome
Rather than loading all FA icons, we selectively choose the ones that we need.  These are defined in `src/plugins/fontawesome-vue.js`.
To bring in a new icon, import it from the appropriate node_module, and then add it to the `library.add(...)` call.
You do not need to import anything in your components or pages, they are globally available.

## Bootstrap
This project uses bootstrap-vue, and it is available globally as well.
https://bootstrap-vue.org/docs

## Adding providers
Add a new service named <provider>.provider.js in `src/service`.  See [github.provider.js](src/service/github.provider.js) as an example.
This will need the following:
    - `dashboardActions`: An array of objects that describe the actions a user can take from the dashboard (after selecting the provider)
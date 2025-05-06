## OWASP Threat Dragon Site

This is a Vue project that serves as the front end of the OWASP Threat Dragon website project,
and also provides the electron desktop project.

## Project setup

`npm install`

### Compiles and hot-reloads for development

`npm run dev:site` or from the root directory: `npm run dev`

### Compiles and minifies for production

`npm run build:site` or from the root directory: `npm run build`

### Builds the desktop application

`npm run build:desktop` or from the root directory: `npm run build:desktop`

### Runs the desktop application for development

`npm run start:desktop:dev` or from the root directory: `npm run start:desktop`

Clean the distribution with

`npm run clean:vue` or from the root directory: `npm run clean`

### Run unit tests

`npm run test:vue` or from the root directory: `npm test`

For continuous testing:

`npm run test:vue -- --watch` or from the root directory: `npm run test:vue -- --watch`

Jest coverage will only show coverage for files containing executable javascript.
This means that vue components without any JS logic will not be included in the coverage report.
This is a known limitation, so if you are reading this and there is a workaround
or you know of another way of getting better coverage for `.vue` files, please open an issue or submit a PR! :)

### Run e2e tests

`npm run test:e2e` or from the root directory: `npm run test:e2e`

For local e2e testing:

`npm run test:e2e:local` or from the root directory: `npm run test:e2e:local`

### Lints and fixes files

`npm run lint` or from the root directory: `npm run lint:vue`

To fix linting issues:

`npm run lint:fix:vue` or from the root directory: `npm run lint:fix:vue`

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
See the existing provider implementations in the `src/service/provider` directory as examples.
This will need the following:

- `dashboardActions`: An array of objects that describe the actions a user can take from the dashboard
    (after selecting the provider)

## Local Storage

[vuex-persist](https://github.com/championswimmer/vuex-persist) is used to save stores / state from vuex to session storage.
By default, all stores are persisted to session storage.
This is configured in [vuex-persist](src/plugins/vuex-persist.js).

## Deployment Notes

### CSS MIME Type Configuration

**IMPORTANT**: When deploying to remote servers, ensure your web server is correctly configured to serve CSS files with the appropriate MIME type to prevent "Refused to apply style" errors. Without this configuration, styling will be broken.

- **Apache**: Add to `.htaccess`: 
  ```
  AddType text/css .css
  ```

- **Nginx**: Add to server config: 
  ```
  types {
    text/css css;
  }
  ```

- **Express**: Ensure proper static file serving: 
  ```javascript
  app.use(express.static('public', { 
    setHeaders: (res, path) => { 
      if (path.endsWith('.css')) res.setHeader('Content-Type', 'text/css'); 
    } 
  }));
  ```

### Provider Route Parameters

The application uses different routing patterns for different storage providers. When using providers like Google Drive, ensure all required parameters are present in the URL:

- **Google Drive**: Requires `folder` parameter for all authenticated routes
- **Local/Demo**: Uses a simpler route pattern without provider-specific parameters

## Known Issues and Future Improvements

### Vue I18n Legacy API Mode

Vue I18n v11 warns about using the Legacy API mode in the console. To fully fix this warning, the application components need to be migrated from Options API (`$t()`) to Composition API (`useI18n()`) style. This is a significant change that would require updating all Vue components.

The i18n configuration has been updated to use `legacy: false`, but the components still need to be updated to use the Composition API pattern.

### Electron Desktop Application

The desktop application is built using Electron. There are two build methods available:

1. Full build: `npm run build:desktop:full` - Builds the site and then packages it as a desktop application
2. Simple build: `npm run build:desktop:simple` - Builds a simplified version for development testing

To package the desktop application for different platforms:

- Windows: `npm run package:desktop:win`
- macOS: `npm run package:desktop:mac`
- Linux: `npm run package:desktop:linux`

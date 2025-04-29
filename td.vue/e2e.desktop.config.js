// Cypress configuration for desktop Electron testing
// This replaces the WebdriverIO tests for the desktop application

const { defineConfig } = require('cypress');
const path = require('path');

module.exports = defineConfig({
  fixturesFolder: 'tests/e2e/fixtures',
  screenshotsFolder: 'tests/e2e/screenshots/desktop',
  videosFolder: 'tests/e2e/videos/desktop',
  e2e: {
    setupNodeEvents(on, config) {
      // We can implement Electron-specific event handling here
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'electron') {
          // Modify Electron browser configuration as needed
          launchOptions.args = [
            ...launchOptions.args,
            // Use the correct path to the desktop app if testing against actual build
            // '--app=' + path.resolve(__dirname, 'dist-desktop'), 
          ];
          
          // Set window size
          launchOptions.preferences.width = 1400;
          launchOptions.preferences.height = 900;
          
          // Enable DevTools in development
          if (process.env.NODE_ENV !== 'production') {
            launchOptions.preferences.devTools = true;
          }
          
          return launchOptions;
        }
      });
      
      // You can define additional tasks here
      on('task', {
        // Example task for logging
        log(message) {
          console.log(`Cypress Task: ${message}`);
          return null;
        }
      });
    },
    specPattern: 'tests/e2e/desktop/**/*.cy.js',
    supportFile: 'tests/e2e/support/desktop.js',
    baseUrl: 'http://localhost:8080/?e2e=true', // Use local dev server for testing
    // Can use 'app://./index.html' when testing actual Electron app
    experimentalInteractiveRunEvents: true,
    experimentalStudio: true,
  },
  env: {
    isElectron: true,
    isDesktopTest: true,
  },
  viewportWidth: 1400,
  viewportHeight: 900,
});
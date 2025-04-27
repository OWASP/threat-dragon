const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    specPattern: 'tests/e2e/**/*.cy.js',
    supportFile: 'tests/e2e/support/index.js',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
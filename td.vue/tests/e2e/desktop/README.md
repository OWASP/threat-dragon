# Threat Dragon Desktop Electron Testing

This directory contains Cypress tests for the Electron desktop application.

## Overview

These tests replace the previous WebdriverIO tests and allow desktop application testing using Cypress, which:

1. Consolidates testing frameworks (Cypress for both web and desktop)
2. Eliminates vulnerable WebdriverIO dependencies
3. Improves test maintainability

## Running Tests

To run the desktop tests:

```bash
npm run test:e2e:desktop
```

## Test Structure

1. **Desktop Configuration**: `e2e.desktop.config.js` configures Cypress for Electron testing
2. **Support File**: `tests/e2e/support/desktop.js` contains Electron IPC mocks
3. **Test Files**: `*.cy.js` files contain the actual test cases

## Mocked Electron APIs

The tests mock Electron's IPC bridge using `cy.stub()`. These mocks allow testing Electron-specific functionality even when running in a regular browser. Key mocked APIs include:

- File operations (open/save)
- App information
- Recent models list
- Update notifications

## Writing New Tests

When adding new desktop-specific tests:

1. Add any required API mocks to `desktop.js` support file
2. Create tests in `*.cy.js` files in this directory
3. Use `cy.window().then(win => { ... })` to access the mocked Electron APIs
4. Keep tests focused on desktop-specific functionality

## Tips

- Use `cy.log()` for debugging
- Test both UI components and Electron API interactions
- The mocked APIs return consistent test values for validation
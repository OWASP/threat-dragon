# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This project is a threat modeling tool that enables the creation of data flow diagrams and then associating threats
with components on those diagrams, and facilitates saving and loading threat model files.

The app is in a monorepo; it has two main components:

- td.server is an express web server that provides an API and functionality like OAuth login with different providers
- td.vue is a Vue web application that is a web site front end to the application, and it is build on the webpack dev server.

The app uses the open source AntV/X6 package for diagramming functionality.

## Build Commands

- Start development: `npm run dev` (both server and vue)
- Build app: `npm run build`
- Test: `npm run test` (all tests)
- Test a single test: `npm run test:single "**/path/to/test.spec.js"`
- Lint: `npm run lint`
- Lint with auto-fix: `npm run lint:fix`
- Generate SBOM: `npm run make-sbom`

## Code Style

- Single quotes for strings
- 4-space indentation
- Semicolons required
- Vue.js code follows 'plugin:vue/vue3-recommended' rules
- Jest for testing (with vue3-jest for components)
- Cypress for e2e testing
- Linting is configured to use eslintjs and prettier

## Project Structure

- td.server: Backend Node.js/Express application
- td.vue: Frontend Vue.js application
- Vue 3 with Vuex state management
- Bootstrap 5 with Bootstrap-Vue-Next
- Desktop application built with Electron

## Naming Conventions

- PascalCase for components
- camelCase for functions and variables
- Use descriptive names that reflect purpose
- Prefix private methods/properties with underscore

### NPM Script Naming Conventions

- `*:server`: Refers to the td.server directory or server app
- `*:vue`: Refers to the td.vue directory or component
- `*:site`: Refers to td.vue running as a web application
- `*:desktop`: Refers to the Electron application
- `*` (no suffix): Refers to scripts operating on the entire project

## Error Handling

- Consistent error handling patterns
- Use try/catch blocks for async code
- Provide informative error messages
- Prefer the configured logging frameworks

## User preferences

- Never disable, skip, or suppress the output of failing test cases - diagnose to root cause
- If a test case is no longer applicable, ask the user what to do
- The test defines the desired functionality. When re-engineering test cases, try to preserve the original intent.
- Prefer built-in functionality of the existing frameworks and packages, over adding new packages
- When making the same kind of change to many files or components, frequently stop to ensure that build and test
  are not breaking.
- If you ever want to look at a version of the application state before we made any changes, you can always look
  at the repo at <https://www.github.com/OWASP/threat-dragon>

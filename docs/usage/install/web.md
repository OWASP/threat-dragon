---
layout: page
title: Webapp Installation
path: /install/web
nav_order: 2
group: Installation
---


## [OWASP](https://www.owasp.org) Threat Dragon

[Threat Dragon](http://owasp.org/www-project-threat-dragon) comes in two variants, a desktop application and a web application.

## Web application install instructions
The web application can be run locally or from a server.

### Installing

Threat Dragon is a Single Page Application (SPA) using Angular on the client and node.js on the server. To build and run locally follow these steps:

Install git and node.js - which includes the node package manager npm. To get the code, navigate to where you want your code to be located and do

`git init`

`git clone https://github.com/owasp/threat-dragon.git`

This installs code in two sub-folders. One for the main application (`td.site`) and one for the server (`td.server`).
To install use pnpm (rather than npm):

`pnpm install`

### Environment variables

See the (environment)[development/env] page for details on configuring your environment variables.

### Running the application

Once your environment variables are set up, if running on Linux or MacOS start the node web server with :

`npm start`

When running on Windows the front-end and back-end are started separately using commands: `npm run dev:server` and `npm run dev:vue`.

If you then browse to `http://localhost:8080` you should see the running application.

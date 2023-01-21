---
layout: page
title: Webapp Installation
nav_order: 2
path: /install/web
group: Installation
---


## [OWASP](https://www.owasp.org) Threat Dragon

[Threat Dragon](http://owasp.org/www-project-threat-dragon) comes in two variants, a desktop application and a web application.

## Web application install instructions
The web application can be run locally or from a server.

### Installing

Threat Dragon is a Single Page Application (SPA) using Angular on the client and node.js on the server. To build and run locally follow these steps:

Install [node.js](https://nodejs.org/en/download/), which includes the node package manager `npm`,
and also install [git](https://git-scm.com/downloads).
To get the code, navigate to where you want your code to be located and run

```
git init
git clone https://github.com/owasp/threat-dragon.git
```

This installs code in two sub-folders. One for the main application (`td.site`) and one for the server (`td.server`).
To install use pnpm (rather than npm):

`pnpm install`

### Environment variables

See the [environment]({{ 'development/environment.html' | relative_url }}) page for details on configuring your environment variables.

### Running the application

Once your environment variables are set up, if running on Linux or MacOS start the node web server with :

`npm start`

When running on Windows the front-end and back-end are started separately using commands: `npm run dev:server` and `npm run dev:vue`.

If you then browse to `http://localhost:8080` you should see the running application.

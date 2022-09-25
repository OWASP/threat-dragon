---
layout: page
title: Local Development
nav_order: 2
path: /local
group: Local
---

# Local Development

## Quickstart
1. Clone the repository: `git clone https://github.com/OWASP/threat-dragon.git`
1. [Install pnpm](https://pnpm.io/installation) and use node 16
1. Run `pnpm install`
1. Configure your [environment](./env)
1. Run `pnpm dev:server`
1. In another terminal, run `pnpm dev:vue`
1. Visit [http://localhost:8080](http://localhost:8080/)

## Coding style
The coding style is not strict, and follows generally accepted styles such as
[Javascript Info](https://javascript.info/coding-style).
We thought about using adopting [JavaScript Standard Style](https://github.com/standard/standard),
but the dropping of unnecessary semicolons was too strict for us.

Indents are set to 4 for now, but this may change and we might go to a 2 space indentation sometime soon.

## Dependencies

### Pnpm
Threat Dragon uses pnpm as a package manager.  You can install it by running `npm install -g pnpm`,
or by following any of the [alternative installation methods](https://pnpm.io/installation).

### NodeJs
Threat Dragon uses nodejs and is developed against version 16.
If you already have pnpm installed and do not have a node version manager,
you can easily manage your node environment (version) commands from [pnpm](https://pnpm.io/cli/env).

There are multiple ways of installing and managing versions of node,
including [nvm](https://github.com/nvm-sh/nvm) and some others, the choice is yours!

## Running Locally
The local environment is split into different parts: `td.server` and `td.vue`.
These can run and be tested independently of one another.
The server is configured to use port 3000 by default, and the Vue project is configured to proxy all requests beginning with `/api`
to the locally running server on port 3000.  This is configured in `td.vue/vue.config.js`

### HTTP vs HTTPS
The default protocol for accessing the Threat Dragon back-end is HTTPS, and this is highly recommended for any production environment.
This causes problems in local development environments,
so the protocol may need to be set to HTTP using `SERVER_API_PROTOCOL=http` in the `.env` file
or as a shell environment variable.

The following run scripts have been standardized across all sub-projects.
From the top level, each command should have a corresponding project-specific command
in the format `<command>:<vue|server|desktop>`. As an example run from top-level:

{:.table .table-striped}
| Command | Description |
| ---- | ---- | ---- |
| `pnpm build` | Builds the web-based project(s). |
| `pnpm dev` | Starts the development version of the project and watches for changes. *This requires using two different terminals.* Run `pnpm dev:vue` and in another terminal, `pnpm dev:server`. |
| `pnpm start` | Starts the development version of the project(s) using [pm2](https://github.com/Unitech/pm2). *This only requires a single terminal*. |
| `pnpm start:desktop` | Starts the development desktop version. |
| `pnpm test:vue` | Runs the end-to-end tests in headless mode. |
| `pnpm test` | Runs the unit tests for the project(s). |

## Logs
Server logs `app.log` and  `audit.log` can be accessed from directory `td.server`.

## Desktop
Threat Dragon uses electron to build install images for the desktop application, supporting Linux, MacOS and Windows.
Build these using `pnpm build:desktop` from the top directory.

During development launch the electron-based desktop application from the top directory: `pnpm start:desktop`.
This runs the desktop application in development mode that will relaunch the application as changes are made.

## Docker
A Dockerfile is provided that can be used to create a docker image:
* checkout the threat dragon source repo
* from the root directory build the docker image using `docker build -t owasp-threat-dragon:dev .`
* wait for the docker image to build
* create a `.env` environment variable file using the example `example.env` as a template
* run a docker container, mapping port 8080:
`docker run -it --rm -p 8080:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
* navigate in a browser to http://localhost:8080/
* if there is an error in the browser such as 'Cannot GET /' then make sure the `.env` file is correct

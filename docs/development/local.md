---
layout: page
title: Local Development
nav_order: 1
path: /local
group: Local
---

# Local Development

## Quickstart
1. Clone the repository: `git clone https://github.com/OWASP/threat-dragon.git`
1. [Install pnpm](https://pnpm.io/installation) and use node 16
1. Run `pnpm install`
1. Configure your [environment](./env)
1. Run `npm run dev:server`
1. In another terminal, run `npm run dev:vue`
1. Visit [http://localhost:8080](http://localhost:8080/)

## Dependencies

### Pnpm
Threat Dragon uses pnpm as a package manager.  You can install it by running `npm install -g pnpm`, or by following any of the [alternative installation methods](https://pnpm.io/installation) on their website.

### NodeJs
Threat Dragon uses nodejs and is developed against version 16.  If you already have pnpm installed and do not have a node version manager, you can easily manage your node environment (version) commands from [pnpm](https://pnpm.io/cli/env).

There are multiple ways of installing and managing versions of node, including [nvm](https://github.com/nvm-sh/nvm) and some others, the choice is yours!

## Running Locally
The local environment is split into different parts: `td.server` and `td.vue`.  These can technically be ran and tested independently of one another.  The server is configured to use port 3000 by default, and the Vue project is configured to proxy all requests beginning with `/api` to the locally running server on port 3000.  This is configured in `td.vue/vue.config.js`

The following run scripts have been standardized across all sub-projects.  From the top level, each command should have a corresponding project-sepecific command in the format `<command>:<vue|server|desktop>`.

{:.table .table-striped}
| Command | Description | Can run from top-level |
| --- | ----------- | ------- |
| `npm run dev` | Starts the development version of the project and watches for changes. *This requires using two different terminals.* | No, run `npm run dev:vue` and in another terminal, `npm run dev:server`. |
| `npm run start` | Starts the development version of the project(s) using [pm2](https://github.com/Unitech/pm2). *This only requires a single terminal*. | Yes |
| `npm run citest` | Runs the unit tests for the project(s) in a headless mode if available. | Yes |
| `npm run test` | Runs the unit tests for the project(s). | Yes |
| `npm run build` | Builds the project | Yes |

## Logs
Server logs can be accesed at:

```
app.log audit.log
td.server/app.log td.server/audit.log
```

## Desktop

Launch the electron-based desktop application using: _not yet defined_

## Docker
A Dockerfile is provided that can be used to create a docker image:
* checkout the threat dragon source repo
* from the root directory build the docker image using `docker build -t owasp-threat-dragon:dev .`
* wait for the docker image to build
* create a `.env` environment variable file using the example `example.env` as a template
* run a docker container using
`docker run -it -p 8080:8080 -v $(pwd)/.env:/app/td.server/.env owasp-threat-dragon:dev`
* navigate in a browser to http://localhost:8080/
* if there is an error in the browser such as 'Cannot GET /' then make sure `.env` file is correct
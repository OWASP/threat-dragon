# Developer notes for [OWASP](https://www.owasp.org) [Threat Dragon](https://owasp.org/www-project-threat-dragon/) #

## Overview
This is a collection of notes used during development, most of which should be up to date - if not then raise an issue.
The recipes are for both Windows and Linux/MacOS; in general the `npm` and `git` commands are the same on all platforms,
but some of the commands (eg `cd ../..`) need to be modified if running on a Windows platform.

Threat Dragon is a [node.js](https://nodejs.org)
[single page application](https://en.wikipedia.org/wiki/Single-page_application)
built on [Angular](https://angular.io/) framework. It comes in two variants, a web application and a desktop application, both variants use a common core.

The core repo common to both the web app and the desktop app is at
[github.com/OWASP/threat-dragon-core](https://github.com/OWASP/threat-dragon-core)

The desktop application repo, which relies on the core functions, is at
[github.com/OWASP/threat-dragon-desktop](https://github.com/OWASP/threat-dragon-desktop)

The web application repo, which also relies on the core functions, is at
[github.com/OWASP/threat-dragon](https://github.com/OWASP/threat-dragon)

Both application variants install `threat-dragon-core` as part of the install process `npm install`, under directory
`node-modules/owasp-threat-dragon-core`. This package is downloaded during install from the [npmjs registry](https://www.npmjs.com/) as the [owasp-threat-dragon-core](https://www.npmjs.com/package/owasp-threat-dragon-core) package.

## Demo and dev websites
The public sites are updated from Mike Goodwin's original repo at
[github.com/mike-goodwin/owasp-threat-dragon](https://github.com/mike-goodwin/owasp-threat-dragon),
so long as all the pull request checks pass.

* merges to `master` [branch](https://github.com/mike-goodwin/owasp-threat-dragon)
will update the [online demo](https://threatdragon.org/)
* merges to `development` [branch](https://github.com/mike-goodwin/owasp-threat-dragon/tree/development)
will update the [snapshot demo](https://threatdragondev.azurewebsites.net/)

## Documentation
The [documentation repo](https://github.com/threatdragon/threatdragon.github.io) will update documentation
at both [threatdragon.github.io](https://threatdragon.github.io)
and [docs.threatdragon.org](https://docs.threatdragon.org/) websites.

## Install and Run Codebase

#### Install and run web application

```
~> git clone --recursive git@github.com:OWASP/threat-dragon.git
~> cd threat-dragon
~/threat-dragon> npm install
~/threat-dragon> npm test
~/threat-dragon> export GITHUB_CLIENT_ID=<the client id>
~/threat-dragon> export GITHUB_CLIENT_SECRET=<the client secret>
~/threat-dragon> export NODE_ENV=development
~/threat-dragon> export SESSION_STORE=local
~/threat-dragon> export SESSION_SIGNING_KEY=<32 char key>
~/threat-dragon> export SESSION_ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "<32 char key>"}]'
~/threat-dragon> npm start
```

Note that  some [environment variables](setup-env.md) need to be set up for the webapp to run.
Once these are in place then use `npm start` to run the threat dragon server.

Navigate in a browser to http://localhost:3000/ to test the app.
If there is an error such as 'Cannot GET /' then make sure the 
[environment variables](https://github.com/OWASP/threat-dragon/blob/main/setup-env.md) are set up correctly.

#### Install and run desktop application

```
~> git clone git@github.com:OWASP/threat-dragon-desktop.git
~> cd threat-dragon-desktop
~/threat-dragon-desktop> npm install
~/threat-dragon-desktop> npm run pretest
~/threat-dragon-desktop> npm run build-content
~/threat-dragon-desktop> npm test
~/threat-dragon-desktop> npm start
```

The electron-based desktop application should then launch

### Run webapp in docker container
A Dockerfile is provided that can be used to create a docker image:
* checkout the threat dragon source repo
* from the root directory build the docker image using `docker build -t owasp-threat-dragon:dev .`
* wait for the docker image to build
* create a `.env` environment variable file using the example `example.env` as a template
* spin up a docker container using
`docker run -it -p 3000:3000 -v $(pwd)/.env:/app/td.server/.env owasp-threat-dragon:dev`
* navigate in a browser to http://localhost:3000/
* if there is an error in the browser such as 'Cannot GET /' then make sure `.env` file is correct

## Development

#### Develop web application
Install as before:

```
git clone --recursive git@github.com:OWASP/threat-dragon.git -b your-dev-branch-name
cd threat-dragon
npm install
npm test
```

After making changes to the code, run `npm run build`.

Run modified app with `npm run start`, and navigate in a browser to http://localhost:3000/ .
As above, if there is an error such as 'Cannot GET /' then ensure the 
[environment variables](https://github.com/OWASP/threat-dragon/blob/main/setup-env.md) are set up. 

#### Develop desktop application
Install:

```
git clone git@github.com:OWASP/threat-dragon-desktop.git -b your-dev-branch-name
cd threat-dragon-desktop
npm install
npm run pretest
npm run build-content
npm test
ln -sf node_modules/electron/cli.js electron
```

Make changes to code, and depending on the changes (eg .html or .css), `npm run build-content`

Run modified app with either `./electron . run -vv` or `npm run start`

#### Develop core functions using web app
Install and build as before

```
~> git clone --recursive git@github.com:OWASP/threat-dragon.git
~> cd threat-dragon
~/threat-dragon> npm install
~/threat-dragon> npm test
```

Replace the TD core using:

```
~/threat-dragon/td.site> cd node_modules
~/threat-dragon/td.site/node_modules> rm -rf owasp-threat-dragon-core
~/threat-dragon/td.site/node_modules> git clone git@github.com:OWASP/threat-dragon-core.git owasp-threat-dragon-core
~/threat-dragon/td.site/node_modules> cd owasp-threat-dragon-core
~/threat-dragon/td.site/node_modules/owasp-threat-dragon-core> npm install
~/threat-dragon/td.site/node_modules/owasp-threat-dragon-core> npm run build
~/threat-dragon/td.site/node_modules/owasp-threat-dragon-core> npm run pretest
~/threat-dragon/td.site/node_modules/owasp-threat-dragon-core> npm test
~/threat-dragon/td.site/node_modules/owasp-threat-dragon-core> cd ../..
```

Rebuild the webapp using the swapped in core package,
[setting environment variables](https://github.com/OWASP/threat-dragon/blob/main/setup-env.md) :

```
~/threat-dragon> npm run build
~/threat-dragon> export GITHUB_CLIENT_ID=<the client id>
~/threat-dragon> export GITHUB_CLIENT_SECRET=<the client secret>
~/threat-dragon> export NODE_ENV=development
~/threat-dragon> export SESSION_STORE=local
~/threat-dragon> export SESSION_SIGNING_KEY=<32 char key>
~/threat-dragon> export SESSION_ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "<32 char key>"}]'
~/threat-dragon> npm run start
```

The webapp can now be run as normal and tested by navigating in a browser to http://localhost:3000/ .
If changes are made to the core files, then to see them in the webapp (depending on the changes) need to rebuild using
command `npm run build` in core directory and then webapp directory:

```
~/threat-dragon> cd td.site/node_modules/owasp-threat-dragon-core
~/threat-dragon/td.site/node_modules/owasp-threat-dragon-core> npm run build
~/threat-dragon> cd -
~/threat-dragon> npm run build
~/threat-dragon> npm run start
```

#### Develop core functions using desktop app
Install and build as before

```
~> git clone git@github.com:OWASP/threat-dragon-desktop.git
~> cd threat-dragon-desktop
~/threat-dragon-desktop> npm install
~/threat-dragon-desktop> npm run pretest
~/threat-dragon-desktop> npm run build-content
~/threat-dragon-desktop> npm test
```

Replace the TD core using:

```
~/threat-dragon-desktop> cd node_modules
~/threat-dragon-desktop/node_modules> rm -rf owasp-threat-dragon-core
~/threat-dragon-desktop/node_modules> git clone git@github.com:OWASP/threat-dragon-core.git owasp-threat-dragon-core
~/threat-dragon-desktop/node_modules> cd owasp-threat-dragon-core
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm install
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm run build
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm run pretest
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm test
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> cd ../..
```

Rebuild the desktop app using the swapped in core package:

```
~/threat-dragon-desktop> npm run build-content
~/threat-dragon-desktop> ln -sf node_modules/electron/cli.js electron
~/threat-dragon-desktop> ./electron . run --verbose
```

The desktop will run as before. If changes are made to the core files then to see them in the desktop
(depending on the changes) need to rebuild using command ` npm run build` in core directory and then
command ` npm run build-content` in desktop directory:

```
~/threat-dragon-desktop> cd node_modules/owasp-threat-dragon-core
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm run build
~/threat-dragon-desktop> cd -
~/threat-dragon-desktop> npm run build-content
~/threat-dragon-desktop> ./electron . run --verbose
```

### Keep branches in sync
Say your fork or branch is out of sync with the main OWASP repo, usually some commits behind.
This example is for `threat-dragon-desktop` repo, but the same applies to `threat-dragon`
and `threat-dragon-core` repos:

```
git clone https://github.com/<YOUR-USER-NAME>/threat-dragon-desktop.git
cd threat-dragon-desktop
git remote add original https://github.com/OWASP/threat-dragon-desktop
git fetch original
```

Apply the changes with `git merge original/main` or `git rebase --no-ff original/main` .
When happy with _everything_ then `git push --force` to update your repo

_Threat Dragon: making threat models more dragony_


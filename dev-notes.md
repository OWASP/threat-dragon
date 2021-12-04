# Developer notes for [OWASP](https://www.owasp.org) [Threat Dragon](https://owasp.org/www-project-threat-dragon/)

## Overview
This is a collection of notes used during development, most of which should be up to date - if not then raise an issue.
The recipes are for both Windows and Linux/MacOS; in general the `npm` and `git` commands are the same on all platforms,
but some of the commands (eg `cd ../..`) need to be modified if running on a Windows platform.

## Documentation
The [documentation repo](https://github.com/threatdragon/threatdragon.github.io) will update documentation
at both [threatdragon.github.io](https://threatdragon.github.io)
and [docs.threatdragon.org](https://docs.threatdragon.org/) websites.

## Install and Run

### Install and run web application

```
git clone --recursive git@github.com:OWASP/threat-dragon.git
cd threat-dragon
npm install
npm test
export GITHUB_CLIENT_ID=<the client id>
export GITHUB_CLIENT_SECRET=<the client secret>
export NODE_ENV=development
export SESSION_STORE=local
export SESSION_SIGNING_KEY=<32 char key>
export SESSION_ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "<32 char key>"}]'
npm start
```

Note that  some [environment variables](setup-env.md) need to be set up for the webapp to run.
Once these are in place then use `npm start` to run the threat dragon server.

Navigate in a browser to http://localhost:3000/ to test the app.
If there is an error such as 'Cannot GET /' then make sure the 
[environment variables](https://github.com/OWASP/threat-dragon/blob/main/setup-env.md) are set up correctly.

### Install and run desktop application

Launch the electron-based desktop application using:

```
git clone git@github.com:OWASP/threat-dragon.git
cd threat-dragon/td.desktop
npm install
npm run build
npm test
npm start
```

After making changes to code it is usually worth a `npm run build` before `npm run start`

You can debug the changes using `npm run debug` which prints debug messages to the console

### Run webapp in docker container
A Dockerfile is provided that can be used to create a docker image:
* checkout the threat dragon source repo
* from the root directory build the docker image using `docker build -t owasp-threat-dragon:dev .`
* wait for the docker image to build
* create a `.env` environment variable file using the example `example.env` as a template
* run a docker container using
`docker run -it -p 3000:3000 -v $(pwd)/.env:/app/td.server/.env owasp-threat-dragon:dev`
* navigate in a browser to http://localhost:3000/
* if there is an error in the browser such as 'Cannot GET /' then make sure `.env` file is correct

## Release process

The steps used during the release process

### Tag the release
1. `git clone git@github.com:OWASP/threat-dragon.git`
1. `cd threat-dragon`
1. update version declaration, eg `"version": "1.6.0",`, in
`package.json`,
`td.desktop/package.json`,
`td.site/package.json`
and `td.server/package.json`
1. rebuild the applications using the new semver
1. `npm install`
1. `npm run build`
1. `npm test`
1. `git commit -a -m"<some release message>"`
1. `git push`
1. tag the release with appropriate subver `git tag v1.6.0`
1. `git push origin v1.6.0`

### Publish docker image
1. once tagged the workflow pushes the docker image to docker hub 
1. check using `docker pull threatdragon/owasp-threat-dragon:v1.6.0`

Test the releases as above; ideally on all of Windows, linux and MacOS

All going well then update the release notes for the draft in the
[Threat Dragon release area](https://github.com/OWASP/threat-dragon/releases) and make public

Finally ensure Threat Dragon tweets the release on Twitter, and announces it on the OWASP slack channels

## Legacy demo and dev websites
These public sites are updated from Mike Goodwin's original repo at
[github.com/mike-goodwin/owasp-threat-dragon](https://github.com/mike-goodwin/owasp-threat-dragon),
so long as all the pull request checks pass.

* merges to `master` [branch](https://github.com/mike-goodwin/owasp-threat-dragon)
will update the [online demo](https://threatdragon.org/)
* merges to `development` [branch](https://github.com/mike-goodwin/owasp-threat-dragon/tree/development)
will update the [snapshot demo](https://threatdragondev.azurewebsites.net/)

_Threat Dragon: making threat models less threatening_


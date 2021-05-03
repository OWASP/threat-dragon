Note that this repository has been migrated from Mike Goodwin's [original](https://github.com/mike-goodwin/owasp-threat-dragon) ,
which has the issues and pull requests from October 2015 up to June 2020.

<p align="center">
  <img src="https://raw.githubusercontent.com/owasp/threat-dragon-desktop/main/content/images/threatdragon_logo_image.svg" width="200" alt="Threat Dragon Logo"/>
</p>

[![Build Status](https://travis-ci.org/owasp/threat-dragon.svg?branch=main)](https://travis-ci.org/owasp/threat-dragon)
[![codecov.io](http://codecov.io/github/owasp/threat-dragon/coverage.svg?branch=main)](http://codecov.io/github/owasp/threat-dragon?branch=main)
[![GitHub license](https://img.shields.io/github/license/owasp/threat-dragon.svg)](LICENSE.txt)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/OWASP/threat-dragon.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/OWASP/threat-dragon/context:javascript)

# [OWASP](https://www.owasp.org) Threat Dragon #
Threat Dragon is a free, open-source, cross-platform threat modelling application including system diagramming
and a threat rule engine to auto-generate threats/mitigations.
It is an [OWASP Incubator Project](https://www.owasp.org/index.php/OWASP_Threat_Dragon)
and follows the values and principles of the [threat modeling manifesto](https://www.threatmodelingmanifesto.org/).
The roadmap for the project is a simple UX, a powerful rule engine
and integration with other development lifecycle tools.

The application comes in two variants:

1. [**A web application (this repo)**](https://github.com/owasp/threat-dragon):
For the web application, models files are stored in GitHub (other storage will become available).
We are currently maintaining [a working protoype](https://threatdragon.org) in synch with the master code branch.

2. [**A desktop application**](https://github.com/owasp/threat-dragon-desktop):
This is based on [Electron](https://electron.atom.io/).
There are installers available for both Windows and Mac OSX, as well as rpm and debian packages for Linux.
Note that for the desktop variant the models are stored on the local filesystem rather than a remote repository.

[End user help](https://docs.threatdragon.org) is available for both variants.

This repository contains the files for the web application variant.

Core files that are shared between both the desktop and web variants are stored in
a [separate repo](https://github.com/owasp/threat-dragon-core) and are
installed as an [npm package](https://www.npmjs.com/package/owasp-threat-dragon-core).

## Installing
Threat Dragon is a Single Page Application (SPA) using Angular on the client and node.js on the server.
To build and run locally follow these steps:

Install git and node.js - which includes the node package manager npm.
To get the code, navigate to where you want your code to be located and do

- `git init`
- `git clone --recursive https://github.com/owasp/threat-dragon.git`

This installs code in two sub-folders.
One for the back-end application (`td.server`) and one for the front-end (`td.site`).

To install, run: `npm install` from the root of the project.  A `postinstall` script is run that will install dependencies in both the `server` and `site` directories as well.

Running `npm run start` from the root directory of the repository will start the front-end and the server.

### Docker
To run Threat Dragon in a docker container, configure your environment using dotenv
as described in [setup-env.md](setup-env.md) and run the following from the root of the project:
- `docker build -t owasp-threat-dragon:dev .`
- `docker run -it -p 3000:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`

## Environment variables
Threat Dragon uses GitHub to store threat models, so you need to go to your GitHub account and
[register it as a GitHub application](https://github.com/settings/applications/new).
Once you have done that you need to set the Client ID and Client Secret as environment variables
(`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).

You also need to set a session signing key environment variable (`SESSION_SIGNING_KEY`).
Setting up these environment variables has caused some confusion in the past,
so there is a [step-by-step guide](setup-env.md) to this. 

## Running the application
Once your environment variables are set up, start the node web server:

`npm start`

If you then browse to `http://localhost:3000` you should see the running application.

## Building
The basic build script is:

`npm run build`

See `package.json` for other build tasks.

## Running the unit tests
The unit tests are written using Mocha and Karma, coverage is provided by Istanbul via `nyc`.
A few different npm tasks are available, and these are split between the front-end and back-end directories.

For front-end (root of the project):
* `pretest`: runs jshint without the unit tests
* `test-client-phantomjs`, `test-client-firefox`, `test-client-chrome`, `test-client-ie`:
runs client side tests using the specified browser
* `test`: runs jshint, client side tests on Firefox and PhantomJS (this is what runs on Travis CI)
* `test-local`: runs jshint, client side tests on all browsers (useful as a pre-push git hook)
* `citest`: continously runs client side tests in PhantomJS with `--single-run false` (useful while coding)

For the back-end (from the `td.server` directory):
* `pretest`: runs jshint without the unit tests
* `test`: runs the server side tests

**Note:** If you are on Windows and are having problems installing Karma,
the simplest way to resolve this seems to be to install
Python v2.7.x (not v3+) and then install Visual Studio Express as per the SO answer suggested in
[this link](http://codedmi.com/questions/298619/npm-install-g-karma-error-msb4019-the-imported-project-c-microsoft-cpp-defau).
This sounds mad, but the alternative is a world of pain installing various patches and components one by one.
At least it's free :o/

# Contributing #
Pull requests, feature requests, bug reports and feedback of any kind are very welcome, please refer to the page for
[contributors](https://github.com/OWASP/threat-dragon-core/blob/main/CONTRIBUTING.md). 

We are trying to keep the test coverage relatively high,
so please try to update tests in any PRs and make PRs on the development branch.
There are some [developer notes](dev-notes.md) to help get started with this project.

# Vulnerability disclosure #
If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority.
For secure disclosure, please see the [security policy](SECURITY.md).

### Project leaders
* Mike Goodwin (mike.goodwin@owasp.org)
* Jon Gadsden (jon.gadsden@owasp.org)

Note that this repository has been migrated from Mike Goodwin's [original](https://github.com/mike-goodwin/owasp-threat-dragon) ,
which has the issues and pull requests from October 2015 up to June 2020.

<p align="center">
  <img src="https://raw.githubusercontent.com/owasp/threat-dragon-desktop/main/content/images/threatdragon_logo_image.svg" width="200" alt="Threat Dragon Logo"/>
</p>

[![Build Status](https://travis-ci.org/owasp/threat-dragon.svg?branch=main)](https://travis-ci.org/owasp/threat-dragon)
[![codecov.io](http://codecov.io/github/owasp/threat-dragon/coverage.svg?branch=main)](http://codecov.io/github/owasp/threat-dragon?branch=main)
[![GitHub license](https://img.shields.io/github/license/owasp/threat-dragon.svg)](LICENSE.txt)
[![Known Vulnerabilities](https://snyk.io/test/github/owasp/threat-dragon/badge.svg)](https://snyk.io/test/github/owasp/threat-dragon)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/OWASP/threat-dragon.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/OWASP/threat-dragon/context:javascript)

# [OWASP](https://www.owasp.org) Threat Dragon #

Threat Dragon is a free, open-source, cross-platform threat modelling application including system diagramming
and a threat rule engine to auto-generate threats/mitigations. It is an [OWASP Incubator Project](https://www.owasp.org/index.php/OWASP_Threat_Dragon).
The focus of the project is on great UX, a powerful rule engine and integration with other development lifecycle tools.

The application comes in two variants:

1. [**A web application (this repo)**](https://github.com/owasp/threat-dragon):
For the web application, models files are stored in GitHub (other storage will become available).
We are currently maintaining [a working protoype](https://threatdragon.org) in synch with the master code branch.

2. [**A desktop application**](https://github.com/owasp/threat-dragon-desktop): This is based on [Electron](https://electron.atom.io/).
There are installers available for both Windows and Mac OSX, as well as rpm and debian packages for Linux.
Note that for the desktop variant the models are stored on the local filesystem rather than a remote repository.

[End user help](https://threatdragon.github.io) is available for both variants.

This repository contains the files for the web application variant.

Core files that are shared between both the desktop and web variants are stored in an [seperate repo](https://github.com/owasp/threat-dragon-core)
and are installable as a [seperate package](https://www.npmjs.com/package/owasp-threat-dragon-core).

## Installing

Threat Dragon is a Single Page Application (SPA) using Angular on the client and node.js on the server. To build and run locally follow these steps:

Install git and node.js - which includes the node package manager npm. To get the code, navigate to where you want your code to be located and do

`git init`

`git clone https://github.com/owasp/threat-dragon.git`

This installs code in two sub-folders. One for the main application (`td`) and one for the unit tests (`td.tests`). To install, do:

`npm install`

## Environment variables

Threat Dragon uses GitHub to store threat models, so you need to go to your GitHub account and
[register it as a GitHub application](https://github.com/settings/applications/new).
Once you have done that you need to set the Client ID and Client Secret as environment variables (`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).

You also need to set a session signing key environment variable (`SESSION_SIGNING_KEY`).
Setting up these environment variables has caused some confusion in the past, so there is a [step-by-step guide](setup-env.md) to this. 

Once a user is signed in, their session information contains an OAuth access token with write access to their GitHub repos.
For security, this is encrypted before storage in the session. The session encryption supports multiple keys so that they can be expired
without any interruption to the running application. The primary key is always used for encryption. Retired keys can be kept available
for decrypting existing sessions. Once all sessions are using the new primary key (typically this will be around 60 minutes maximum),
the old one can be safely removed. The keys are stored as a JSON string in  the `SESSION_ENCRYPTION_KEYS` environment variable. For example:

`[{\"isPrimary\": true, \"id\": 0, \"value\": \"abcdef\"}, {\"isPrimary\": false, \"id\": 1, \"value\": \"ghijkl\"}]`

If you are developing locally, you can choose to store the session data in memory using the express-session in-memory store. To do this the
`SESSION_STORE`environment variale to `local`. As [mentioned in the express-session docs](https://github.com/expressjs/session) this is for
development only - it is not suitable for production. To remind you of this, Threat Dragon will write a log message at severity ERROR when
it starts if the in memory session store is used.

For production use, Threat Dragon currently supports Azure Table Storage for the session store via
[connect-azuretables](https://www.npmjs.com/package/connect-azuretables). To make this store work you need to specify an Azure Storage Account
and key as environment variables `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`.
See the [connect-azuretables](https://www.npmjs.com/package/connect-azuretables) documentation for more options.

If you want to use an [alternative session store](https://github.com/expressjs/session#compatible-session-stores) in production,
install it and edit the [session.config.js](https://github.com/owasp/threat-dragon/blob/master/td/config/session.config.js) file.

Lastly, by default, Threat Dragon will set the `secure` flag on cookies. To override this for development purposes,
set the `NODE_ENV` environment variable to `development`. 

## Running the application

Once your environment variables are set up, start the node web server:

`npm start`

If you then browse to `http://localhost:3000` you should see the running application.

## Building

The basic build script is:

`npm run build`

See `package.json` for other build tasks.

## Running the unit tests

The unit tests are written using Jasmine and Karma. Coverage is by Istanbul. A few different npm tasks are available:

* `pretest`: runs jshint without the unit tests
* `test-client-phantomjs`, `test-client-firefox`, `test-client-chrome`, `test-client-ie`: runs client side tests using the specified browser
* `test-server`: runs the server side tests
* `test`: runs jshint, client side tests on Firefox and PhantomJS and server side tests (this is what runs on Travis CI)
* `test-local`: runs jshint, client side tests on all browsers and then the server side tests (useful as a pre-push git hook)
* `citest`: continously runs client side tests in PhantomJS with `--single-run false` (useful while coding)

**Note:** If you are on Windows and are having problems installing Karma, the simplest way to resolve this seems to be to install
Python v2.7.x (not v3+) and then install Visual Studio Express as per the SO answer suggested in
[this link](http://codedmi.com/questions/298619/npm-install-g-karma-error-msb4019-the-imported-project-c-microsoft-cpp-defau).
This sounds mad, but the alternative is a world of pain installing various patches and components one by one. At least it's free :o/

# Contributing #

Pull requests, feature requests, bug reports and feedback of any kind are very welcome, please refer to the page for
[contributors](https://github.com/OWASP/threat-dragon-core/blob/main/CONTRIBUTING.md). 

We are trying to keep the test coverage relatively high, so please try to update tests in any PRs and make PRs on the development branch.
There are some [developer notes](https://github.com/OWASP/threat-dragon-core/blob/main/dev-notes.md) in the core
[threat dragon](https://github.com/OWASP/threat-dragon-core) repo to help get started with this project.

# Vulnerability disclosure #

If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority.
For secure disclosure, please see the [security policy](SECURITY.md).

# Project leader #

Mike Goodwin (mike.goodwin@owasp.org)



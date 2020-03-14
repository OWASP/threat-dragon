<p align="center">
  <img src="http://mike-goodwin.github.io/owasp-threat-dragon/content/images/threatdragon_logo_image.svg" width="200" alt="Threat Dragon Logo"/>
</p>

[![Build Status](https://travis-ci.org/mike-goodwin/owasp-threat-dragon.svg?branch=master)](https://travis-ci.org/mike-goodwin/owasp-threat-dragon) [![codecov.io](http://codecov.io/github/mike-goodwin/owasp-threat-dragon/coverage.svg?branch=master)](http://codecov.io/github/mike-goodwin/owasp-threat-dragon?branch=master) [![Code Climate](https://codeclimate.com/github/mike-goodwin/owasp-threat-dragon/badges/gpa.svg)](https://codeclimate.com/github/mike-goodwin/owasp-threat-dragon) [![SecurityHeaders.io](https://securityheadersiobadges.azurewebsites.net/create/badge?domain=https://threatdragon.azurewebsites.net/)](https://securityheaders.io/?q=https://threatdragon.azurewebsites.net/&hide=on&followRedirects=on) [![GitHub license](https://img.shields.io/github/license/mike-goodwin/owasp-threat-dragon.svg)](LICENSE.txt)
[![Dependency Status](https://dependencyci.com/github/mike-goodwin/owasp-threat-dragon/badge)](https://dependencyci.com/github/mike-goodwin/owasp-threat-dragon)
[![Known Vulnerabilities](https://snyk.io/test/github/mike-goodwin/owasp-threat-dragon/badge.svg)](https://snyk.io/test/github/mike-goodwin/owasp-threat-dragon)

# [OWASP](https://www.owasp.org) Threat Dragon #

Threat Dragon is a free, open-source, cross-platform threat modelling application including system diagramming and a threat rule engine to auto-generate threats/mitigations. It is an [OWASP Incubator Project](https://www.owasp.org/index.php/OWASP_Threat_Dragon). The focus of the project is on great UX, a powerful rule engine and integration with other development lifecycle tools.

The application comes in two variants:

1. [**A web application (this repo)**](https://github.com/mike-goodwin/owasp-threat-dragon): For the web application, models files are stored in GitHub (other storage will become available). We are currently maintaining [a working protoype](https://threatdragon.org) in synch with the master code branch.

2. [**A desktop application**](https://github.com/mike-goodwin/owasp-threat-dragon-desktop): This is based on [Electron](https://electron.atom.io/). There are installers available for both Windows and Mac OSX, as well as rpm and debian packages for Linux. Note that for the desktop variant the models are stored on the local filesystem rather than a remote repository.

[End user help](http://docs.threatdragon.org/) is available for both variants.

This repository contains the files for the web application variant.

Core files that are shared between both the desktop and web variants are stored in an [seperate repo](https://github.com/mike-goodwin/owasp-threat-dragon-core) and are installable as a [seperate package](https://www.npmjs.com/package/owasp-threat-dragon-core).

## Installing

Threat Dragon is a Single Page Application (SPA) using Angular on the client and node.js on the server. To build and run locally follow these steps:

Install git and node.js - which includes the node package manager npm. To get the code, navigate to where you want your code to be located and do

`git init`

`git clone https://github.com/mike-goodwin/owasp-threat-dragon.git`

This installs code in two sub-folders. One for the main application (`td`) and one for the unit tests (`td.tests`). To install, do:

`npm install`

## Environment variables

Threat Dragon uses GitHub to store threat models, so you need to go to your GitHub account and [register it as a GitHub application](https://github.com/settings/applications/new). Once you have done that you need to set the Client ID and Client Secret as environment variables (`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).

You also need to set a session signing key environment variable (`SESSION_SIGNING_KEY`).

Once a user is signed in, their session information contains an OAuth access token with write access to their GitHub repos. For security, this is encrypted before storage in the session. The session encryption supports multiple keys so that they can be expired without any interruption to the running application. The primary key is always used for encryption. Retired keys can be kept available for decrypting existing sessions. Once all sessions are using the new primary key (typically this will be around 60 minutes maximum), the old one can be safely removed. The keys are stored as a JSON string in  the `SESSION_ENCRYPTION_KEYS` environment variable. For example:

`[{\"isPrimary\": true, \"id\": 0, \"value\": \"abcdef\"}, {\"isPrimary\": false, \"id\": 1, \"value\": \"ghijkl\"}]`

If you are developing locally, you can choose to store the session data in memory using the express-session in-memory store. To do this the `SESSION_STORE`environment variale to `local`. As [mentioned in the express-session docs](https://github.com/expressjs/session) this is for development only - it is not suitable for production. To remind you of this, Threat Dragon will write a log message at severity ERROR when it starts if the in memory session store is used.

For production use, Threat Dragon currently supports Azure Table Storage for the session store via [connect-azuretables](https://www.npmjs.com/package/connect-azuretables). To make this store work you need to specify an Azure Storage Account and key as environment variables `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`. See the [connect-azuretables](https://www.npmjs.com/package/connect-azuretables) documentation for more options.

If you want to use an [alternative session store](https://github.com/expressjs/session#compatible-session-stores) in production, install it and edit the [session.config.js](https://github.com/mike-goodwin/owasp-threat-dragon/blob/master/td/config/session.config.js) file.

Lastly, by default, Threat Dragon will set the `secure` flag on cookies. To override this for development purposes, set the `NODE_ENV` environment variable to `development`. 

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

**Note:** If you are on Windows and are having problems installing Karma, the simplest way to resolve this seems to be to install Python v2.7.x (not v3+) and then install Visual Studio Express as per the SO answer suggested in [this link](http://codedmi.com/questions/298619/npm-install-g-karma-error-msb4019-the-imported-project-c-microsoft-cpp-defau). This sounds mad, but the alternative is a world of pain installing various patches and components one by one. At least it's free :o/

# Contributing #

PRs, feature requests, bug reports and feedback of any kind are very welcome. We are trying to keep the test coverage relatively high, so please try to include tests in any PRs and make PRs on the development branch.

# Vulnerability disclosure #

If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority. For secure disclosure, please email mike.goodwin@owasp.org using the following PGP key:

```-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: FlowCrypt 5.1.8 Gmail Encryption flowcrypt.com
Comment: Seamlessly send, receive and search encrypted email

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
Odp+4g==
=8d0U
-----END PGP PUBLIC KEY BLOCK-----
```

If you are not a PGP user, you can easily send an encrypted email from https://flowcrypt.com/me/mikegoodwin

# Project leader #

Mike Goodwin (mike.goodwin@owasp.org)



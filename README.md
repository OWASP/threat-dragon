<p align="center">
  <img src="http://mike-goodwin.github.io/owasp-threat-dragon/content/images/threatdragon_logo_image.svg" width="200" alt="Threat Dragon Logo"/>
</p>

[![Build Status](https://travis-ci.org/mike-goodwin/owasp-threat-dragon.svg?branch=master)](https://travis-ci.org/mike-goodwin/owasp-threat-dragon) [![codecov.io](http://codecov.io/github/mike-goodwin/owasp-threat-dragon/coverage.svg?branch=master)](http://codecov.io/github/mike-goodwin/owasp-threat-dragon?branch=master) [![Code Climate](https://codeclimate.com/github/mike-goodwin/owasp-threat-dragon/badges/gpa.svg)](https://codeclimate.com/github/mike-goodwin/owasp-threat-dragon) [![SecurityHeaders.io](https://securityheadersiobadges.azurewebsites.net/create/badge?domain=https://threatdragon.azurewebsites.net/)](https://securityheaders.io/?q=https://threatdragon.azurewebsites.net/&hide=on) [![GitHub license](https://img.shields.io/github/license/mike-goodwin/owasp-threat-dragon.svg)](LICENSE.txt)

# [OWASP](https://www.owasp.org) Threat Dragon #

Threat Dragon is an online threat modelling web application including system diagramming and a rule engine to auto-generate threats/mitigations. It is an [OWASP Incubator Project](https://www.owasp.org/index.php/OWASP_Threat_Dragon). The focus will be on great UX, a powerful rule engine and integration with other development lifecycle tools.

We are currently maintaining [a working protoype](http://threatdragon.azurewebsites.net/#/) in sych with the master code branch.

**Project leader:** Mike Goodwin (mike.goodwin@owasp.org)

##Installing

ThreatDragon is a Single Page Application (SPA) using Angular on the client and node.js on the server. To build and run locally, follow these steps:

Install Git and node.js. To get the code, go to where you want your code to be located and do

`git init`

`git clone https://github.com/mike-goodwin/owasp-threat-dragon.git`

This installs code in two sub-folders. One for the main application (`td`) and one for the unit tests (`td.tests`). Get all the node packages:

`npm install`

##Environment variables

Threat Dragon uses GitHub to store threat models, so you need to go to your GitHub account and [register it as a GitHub application](https://github.com/settings/applications/new). Once you have done that you need to set the Client ID and Client Secret as environment variables (`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).

You also need to set a session signing key environment variable (`SESSION_SIGNING_KEY`).

Once a user is signed in, their session information contains an OAuth access token with write access to their GitHub repos. For security, this is encrypted before storage in the session. The session encryption supports multiple keys so that they can be expired without any interruption to the running application. The primary key is always used for encryption. Retired keys can be kept available for decrypting existing sessions. Once all sessions are using the new primary key (typically this will be around 60 minutes maximum), the old one can be safely removed. The keys are stored as a JSON string in  the `SESSION_ENCRYPTION_KEYS` environment variable. For example:

`[{\"isPrimary\": true, \"id\": 0, \"value\": \"abcdef\"}, {\"isPrimary\": false, \"id\": 1, \"value\": \"ghijkl\"}]`

By default Threat Dragon used Azure Table Storage for the session store via [connect-azuretables](https://www.npmjs.com/package/connect-azuretables). To make this work you need to specify an Azure Storage Account and key as environment variables `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`. See the [connect-azuretables](https://www.npmjs.com/package/connect-azuretables) documentation for more options.

If you don't want to use Azure Table Storage you can set the `SESSION_STORAGE`environment variale to `local`. Threat Dragon will then use the express-session in-memory session store. As [mentioned in the express-session docs](https://github.com/expressjs/session) this is for development only - it is not suitable for production.

If you want to use an [alternative session store](https://github.com/expressjs/session#compatible-session-stores) in production, install it and edit the [session.config.js](https://github.com/mike-goodwin/owasp-threat-dragon/blob/master/td/config/session.config.js) file.

Lastly, by default, Threat Dragon will set the `secure` flag on cookies. To override this for development purposes, set the `NODE_ENV` environment variable to `development`. 

##Running the application

Once your environment variables are set up start the node web server:

`npm start`

If you then browse to `http://localhost:3000` you should see the running application.

##Debug builds

Threat Dragon currently uses [Grunt](http://gruntjs.com/) for its build workflow, so if you want to change the build, do

`npm install -g grunt-cli`

The default build minifies the Javascript and CSS. It does build code maps, but if you want to run with
unminified files, do:

`grunt debug`

then

`npm start`

##Running the unit tests

The unit tests are written using Jasmine and Karma. Coverage is by Istanbul. A few different npm scripts are available:

* `test-client-phantomjs`, `test-client-firefox`, `test-client-chrome`, `test-client-ie`: runs client side tests using the specified browser
* `test-server`: runs the server side tests
* `test`: runs jshint, client side tests on Firefox and PhantomJS and server side tests (this is what runs on Travis CI)
* `test-local`: runs jshint, client side tests on all browsers and then the server side tests (useful as a pre-push git hook)
* `citest`: continously runs client side tests in PhantomJS with `--single-run false` (useful while coding)

**Note:** If you are on Windows and are having problems installing Karma, the simplest way to resolve this seems to be to install Python v2.7.x (not v3+) and then install Visual Studio Express as per the SO answer suggested in [this link](http://codedmi.com/questions/298619/npm-install-g-karma-error-msb4019-the-imported-project-c-microsoft-cpp-defau). This sounds mad, but the alternative is a world of pain installing various patches and components one by one. At least it's free :o/

###Unit test coverage progress

We aim to maintain unit test coverage at > 90%

![codecov.io](https://codecov.io/github/mike-goodwin/owasp-threat-dragon/branch.svg?branch=master)

Also, the code is currently lint free :)

##Freshness

npm

[![Dependency Status](https://www.versioneye.com/user/projects/56185934a193340f2f000262/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56185934a193340f2f000262) 

bower

[![Dependency Status](https://www.versioneye.com/user/projects/56185933a193340f2800026b/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56185933a193340f2800026b)

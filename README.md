[![Build Status](https://travis-ci.org/mike-goodwin/owasp-threat-dragon.svg?branch=master)](https://travis-ci.org/mike-goodwin/owasp-threat-dragon) 

# [OWASP](https://www.owasp.org) Threat Dragon #

An online threat modelling web application including system diagramming and a rule engine to auto-generate threats/mitigations. 
The focus will be on great UX, a powerful rule engine and integration with other development lifecycle tools.

We are currently maintaining [a working protoype](http://babydragon.azurewebsites.net/#/) in sych with the main code branch.

An [OWASP Incubator Project](https://www.owasp.org/index.php/OWASP_Threat_Dragon).

**Project leader:** Mike Goodwin (mike.goodwin@owasp.org)

##Getting started

ThreatDragon is a Single Page Application (SPA) using Angular on the client and node.js on the server, althought the server side code does almost nothing so far.
To build and run locally, follow these steps:

Install Git and node.js. Threat Dragon uses Grunt for its build workflow, so

`npm install -g grunt-cli`

To get the code, go to where you want your code to be located and do

`git init`

`git clone https://github.com/mike-goodwin/owasp-threat-dragon.git`

This installs code in two sub-folders. One for the main application (`td`) and one for the unit tests (`td.tests`). Get all the node packages:

`npm install`

All the build workflow task are in the default grunt task, so just do

`grunt` or `grunt release`

and then start the node web server:

`npm start`

If you then browse to `http://localhost:3000` you should see the running application.

##Debug builds

The default build minifies the Javascript and CSS. It does build code maps, but if you want to run with
unminified files, do:

`grunt debug`

then

`npm start`

##Running the unit tests

The unit tests are written using Jasmine and can be run with Karma using a Grunt task or using npm. Install recent versions of Chrome, Firefox and IE then run the tests using

`grunt justtest`

to do a full release build and then run the tests, do

`grunt test`

To test using PhantomJS (this is what runs on the Travis CI server)

`npm test`

**Note:** If you are on Windows and are having problems installing Karma, the simplest way to resolve this seems to be to install Python v2.7.x (not v3+) and then install Visual Studio Express as per the SO answer suggested in [this link](http://codedmi.com/questions/298619/npm-install-g-karma-error-msb4019-the-imported-project-c-microsoft-cpp-defau). This sounds mad, but the alternative is a world of pain installing various patches and components one by one. At least it's free :o/

##Project health

npm dependencies

[![Dependency Status](https://www.versioneye.com/user/projects/56185934a193340f2f000262/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56185934a193340f2f000262) 

Javascript dependencies

[![Dependency Status](https://www.versioneye.com/user/projects/56185933a193340f2800026b/badge.svg?style=flat)](https://www.versioneye.com/user/projects/56185933a193340f2800026b)

<p align="center">
  <img src="http://mike-goodwin.github.io/owasp-threat-dragon/content/images/threatdragon_logo_image.svg" width="200" alt="Threat Dragon Logo"/>
</p>

[![Build Status](https://travis-ci.org/mike-goodwin/owasp-threat-dragon-core.svg?branch=master)](https://travis-ci.org/mike-goodwin/owasp-threat-dragon-core) [![codecov.io](http://codecov.io/github/mike-goodwin/owasp-threat-dragon-core/coverage.svg?branch=master)](http://codecov.io/github/mike-goodwin/owasp-threat-drago-core?branch=master) [![Code Climate](https://codeclimate.com/github/mike-goodwin/owasp-threat-dragon-core/badges/gpa.svg)](https://codeclimate.com/github/mike-goodwin/owasp-threat-dragon-core)
[![GitHub license](https://img.shields.io/github/license/mike-goodwin/owasp-threat-dragon-core.svg)](LICENSE.txt)
[![Dependency Status](https://dependencyci.com/github/mike-goodwin/owasp-threat-dragon-core/badge)](https://dependencyci.com/github/mike-goodwin/owasp-threat-dragon-core)

# [OWASP](https://www.owasp.org) Threat Dragon #

Threat Dragon is a free, open-source, cross-platform threat modelling application including system diagramming and a rule engine to auto-generate threats/mitigations. It is an [OWASP Incubator Project](https://www.owasp.org/index.php/OWASP_Threat_Dragon). The focus of the project is on great UX, a powerful rule engine and integration with other development lifecycle tools.

The application comes in two variants:

1. [**A web application**](https://github.com/mike-goodwin/owasp-threat-dragon): For the web application, models files are stored in GitHub (other storage will become available). We are currently maintaining [a working protoype](https://threatdragon.org) in sych with the master code branch.

2. [**A desktop application**](https://github.com/mike-goodwin/owasp-threat-dragon-desktop): This is based on [Electon](https://electron.atom.io/). There are builds available for Windows and OSX (Linux will follow at some point). For this variant, models arfe stored on the local filesystem.

[End user help](http://docs.threatdragon.org/) is available for both variants.

This repository contains the core files and modules that are shared between both the web and desktop variant.

# Installing and building #

Clone the repo and run

`npm install`

There are a number of test scripts included in `package.json`. For example:

`npm run test-client-chrome`

The main test script runs tests on PhantomJS and FireFox (and also lints the code):

`npm test`

There are two main build script, one to pre-compile the angular templates to JavaScript:

`npm run build-templates`

and one to bundle and minify the core CSS:

`npm run bundle-css`

Both of these can be run together using

`npm run build`

# Contributing #

PRs, feature requests, bug reports and feedback of any kind are very welcome. We are trying to keep the test coverage relatively high, so please try to include tests in any PRs and make PRs on the development branch.

# Project leader #

Mike Goodwin (mike.goodwin@owasp.org)

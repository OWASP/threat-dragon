Note that this repository has been migrated from Mike Goodwin's [original](https://github.com/mike-goodwin/owasp-threat-dragon-core) , which has the issues and pull requests from June 2016 up to June 2020.

<p align="center">
  <img src="https://raw.githubusercontent.com/owasp/threat-dragon-desktop/main/content/images/threatdragon_logo_image.svg" width="200" alt="Threat Dragon Logo"/>
</p>

[![Build Status](https://travis-ci.org/owasp/threat-dragon-core.svg?branch=main)](https://travis-ci.org/owasp/threat-dragon-core)
[![codecov.io](http://codecov.io/github/owasp/threat-dragon-core/coverage.svg?branch=main)](http://codecov.io/github/owasp/threat-dragon-core?branch=main)
[![GitHub license](https://img.shields.io/github/license/owasp/threat-dragon-core.svg)](LICENSE.txt)
[![Known Vulnerabilities](https://snyk.io/test/github/owasp/threat-dragon-core/badge.svg)](https://snyk.io/test/github/owasp/threat-dragon-core)

# [OWASP](https://www.owasp.org) Threat Dragon #

Threat Dragon is a free, open-source, cross-platform threat modelling application including system diagramming and a rule
engine to auto-generate threats/mitigations. It is an [OWASP Incubator Project](https://owasp.org/www-project-threat-dragon/).
The focus of the project is on great UX, a powerful rule engine and integration with other development lifecycle tools.

The application comes in two variants:

1. [**A web application**](https://github.com/owasp/threat-dragon): For the web application, models files
are stored in GitHub (other storage will become available). We are currently maintaining
[a working protoype](https://threatdragon.org) in synch with the master code branch.

2. [**A desktop application**](https://github.com/owasp/threat-dragon-desktop): This is based on
[Electron](https://electron.atom.io/). There are installers available for both Windows and Mac OSX, as well as
rpm and debian packages for Linux. For this variant models are stored on the local filesystem.

[End user help](http://docs.threatdragon.org/) is available for both variants.

This repository contains the core files and modules that are shared between both the web and desktop variant.

## Code of Conduct ##

We ask that everyone who contributes to the Threat Dragon project follow the [Code of Conduct](CODE_OF_CONDUCT.md).

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

Pull requests, feature requests, bug reports and feedback of any kind are very welcome, please refer to the page for [contributors](CONTRIBUTING.md). 

We are trying to keep the test coverage relatively high, so please try to include tests in any PRs and make PRs on the development branch.
There are some [developer notes](dev-notes.md) to help get started.

# Vulnerability disclosure #

If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority.
For secure disclosure, please see the [security policy](SECURITY.md).

# Project leader #

Mike Goodwin (mike.goodwin@owasp.org)


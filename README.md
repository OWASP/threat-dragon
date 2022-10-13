<p align="center">
  <img src="https://raw.githubusercontent.com/owasp/threat-dragon/main/td.vue/src/assets/threatdragon_logo_image.svg"
  width="200" alt="Threat Dragon Logo"/>
</p>

[![Build](https://github.com/OWASP/threat-dragon/actions/workflows/ci.yaml/badge.svg)](https://github.com/OWASP/threat-dragon/actions/workflows/ci.yaml)
[![codecov.io](http://codecov.io/github/owasp/threat-dragon/coverage.svg?branch=main)](http://codecov.io/github/owasp/threat-dragon?branch=main)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=SG1sSFpJeUJ0M1pmY1hrM2F0dVNLclRPSzdCb3lLN253MzcrV0liZWd1bz0tLWxXQWdQaTJRcVF1TVEwS2FWbXJxcHc9PQ==--41330f50fd1c2bd4ac8eaac4a36ebfb1577be89b)](https://automate.browserstack.com/public-build/SG1sSFpJeUJ0M1pmY1hrM2F0dVNLclRPSzdCb3lLN253MzcrV0liZWd1bz0tLWxXQWdQaTJRcVF1TVEwS2FWbXJxcHc9PQ==--41330f50fd1c2bd4ac8eaac4a36ebfb1577be89b)
[![Deploy](https://github.com/OWASP/threat-dragon/actions/workflows/deploy.yaml/badge.svg)](https://github.com/OWASP/threat-dragon/actions/workflows/deploy.yaml)
[![GitHub license](https://img.shields.io/github/license/owasp/threat-dragon.svg)](LICENSE.txt)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/OWASP/threat-dragon.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/OWASP/threat-dragon/context:javascript)
[![Trivy Scan](https://github.com/OWASP/threat-dragon/actions/workflows/trivy.yaml/badge.svg)](https://github.com/OWASP/threat-dragon/actions/workflows/trivy.yaml)

# OWASP Threat Dragon

[OWASP](https://www.owasp.org) Threat Dragon is a free, open-source, cross-platform threat modeling application.
It is used to draw threat modeling diagrams and to list threats for elements in the diagram.
[Mike Goodwin](https://github.com/mike-goodwin) created Threat Dragon as an open source community project
that provides an intuitive and accessible way to model threats.

[Threat Dragon](https://threatdragon.github.io/about)
is designed to be accessible for various types of teams, with an emphasis on flexibility and simplicity.
It is an [OWASP Lab Project](https://www.owasp.org/index.php/OWASP_Threat_Dragon)
and follows the values and principles of the [threat modeling manifesto](https://www.threatmodelingmanifesto.org/).

## Check it out
There are [documentation pages](https://threatdragon.github.io/about) to guide you and the production release area, conforming to
[semver](https://semver.org/spec/v2.0.0.html), contains the Threat Dragon 1.x releases.
The next version of Threat Dragon 2.0 is still in development, but you can try the snapshot on [our website](https://www.threatdragon.com/#/).
Also well worth watching the video provided by the [OWASP Spotlight](https://www.youtube.com/playlist?list=PLUKo5k_oSrfOTl27gUmk2o-NBKvkTGw0T) series.

### Version 1.x Maintenance mode
Threat Dragon was originally written using AngularJS version 1.x, which is reaching end of life.
All versions 1.x are using the AngularJS implementation.  Future versions (2.x+) are using Vue.js.
The main branch is now for version 2.x+, which is currently unreleased. 
For more information on building/running version 1.x,
please see the [legacy-v1.x branch](https://github.com/OWASP/threat-dragon/tree/legacy-v1.x).

The [release area](https://github.com/OWASP/threat-dragon/releases) has the version 1.x downloads and this will migrate to version 2.x during 2022. 

## About Threat Dragon
There is a good overview of [threat modeling and risk assessment](https://owasp.org/www-community/Application_Threat_Modeling)
from OWASP, and this expands on what the Threat Dragon project aims for:

- ease of use and accessible
- designing a data flow diagram
- suggesting threats
- entering mitigations and counter measures

[Mike Goodwin](https://github.com/mike-goodwin) is the founder and creator of this project,
and this repository has been migrated from
Mike Goodwin's [original](https://github.com/mike-goodwin/owasp-threat-dragon)
which has the issues and pull requests from October 2015 up to June 2020.
Since then the project team has continued development, culminating with release version 1.6.1.
The project is now going through a substantial changes which will see version 2.0 released in 2022.

Threat Dragon is [primarily a web application](https://github.com/OWASP/threat-dragon/releases),
with threat model files stored in GitHub. Over time other storage methods will become available.

There is also a [desktop version](https://github.com/OWASP/threat-dragon/releases) of Threat Dragon
which stores the threat model files on the local filesystem rather than in a repository.
The releases provide installers for Windows, Mac OSX and Linux.

End user help is available for both the existing [version 1.x](https://threatdragon.github.io)
and upcoming [version 2.x](https://www.threatdragon.com/docs).

### Version 2.0 Development
After many years using AngularJS and JointJS, Threat Dragon is migrating development to Vue
and antv/g6 drawing library. This version will be ready later in 2022,
until then use the [latest version of Threat Dragon 1.x](https://github.com/OWASP/threat-dragon/releases/tag/v1.6.1).

### Installing version 2.x

Install [git](https://git-scm.com/downloads) and [node.js](https://nodejs.org/en/download/)
- which includes the node package manager npm - and then [Install pnpm](https://pnpm.io/installation)

To get the code navigate to a target directory and use command

`git clone https://github.com/owasp/threat-dragon.git`

This downloads the code into a `threat-dragon` directory and the application code is in two sub-folders,
one for the back-end application (`td.server`) and one for the front-end (`td.vue`).

Pnpm (rather than npm) is used to install from the top directory of the project : `pnpm install`

### Environment variables

Threat Dragon uses GitHub to store threat models, so you need to go to your GitHub account and
register it as a GitHub application. There is a
[step by step guide](https://www.threatdragon.com/docs/development/env.html) on how to do this.

You will also have to provide other environment variables, again following
[the documentation](https://www.threatdragon.com/docs/development/env.html) on this.

If running Threat Dragon locally then the front-end to server communication will
probably need to be HTTP rather than HTTPS.
Specify this using environment variable `SERVER_API_PROTOCOL=http` in the dotenv file or the command line.

### Run the application

When running on Windows, and during development, the front-end and back-end
can be started separately in "watch" mode using commands : `pnpm dev:server` and `pnpm dev:vue`.
Alternatively, if running on Linux or MacOS, start both the back-end server and the front-end application
from the top directory using : `pnpm start`.

With both front and back end running, access with a browser at http://localhost:8080/

### Stop the application

If using `pnpm start`, stop both the back-end server and the front-end application from the top directory: `pnpm stop`.
Otherwise break out of both the server and vue front-end.

### Docker (local build)

To run Threat Dragon in a docker container,
first configure your [environment using dotenv](https://www.threatdragon.com/docs/development/env.html)
and run from the top directory of the project:

- `docker build -t owasp-threat-dragon:dev .`
- `docker run -it --rm -p 8080:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`

Using http port 8080 and accessing Threat Dragon on `http://localhost:8080/`.

## Docker (from dockerhub)

Threat Dragon maintains a docker image on Dockerhub. Each release is tagged as `v{major}.{minor}.{patch}`, eg `v1.6.0`

**Do _not use the latest tag_ (which is the default), as it could be a development release**

Alternatively, you can use the `stable` tag, which will always be the latest official release.

- `docker pull threatdragon/owasp-threat-dragon:stable`
- `docker run -it --rm -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:stable`

Assuming that you are using http port 8080 and accessing Threat Dragon on `http://localhost:8080/`.

### Contributing

Pull requests, feature requests, bug reports and feedback of any kind are very welcome, please refer to the page for
[contributors](CONTRIBUTING.md).

There are some [developer notes](https://www.threatdragon.com/docs/development/local.html) to help get started with this project.
We are trying to keep the test coverage relatively high, so please try to update tests in any pull requests
and create these pull requests off the [V2 development main branch](https://github.com/OWASP/threat-dragon).

### Vulnerability disclosure

If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority.
For secure disclosure, please see the [security policy](SECURITY.md).

### Project leaders

- Mike Goodwin (mike.goodwin@owasp.org)
- Jon Gadsden (jon.gadsden@owasp.org)
- Leo Reading (leo.reading@owasp.org)

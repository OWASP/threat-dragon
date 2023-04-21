<p align="center">
  <img src="https://raw.githubusercontent.com/owasp/threat-dragon/main/td.vue/src/assets/threatdragon_logo_image.svg"
  width="200" alt="Threat Dragon Logo"/>
</p>

[![Build](https://github.com/OWASP/threat-dragon/actions/workflows/ci.yaml/badge.svg)](https://github.com/OWASP/threat-dragon/actions/workflows/ci.yaml)
[![BrowserStack Status](https://automate.browserstack.com/badge.svg?badge_key=SG1sSFpJeUJ0M1pmY1hrM2F0dVNLclRPSzdCb3lLN253MzcrV0liZWd1bz0tLWxXQWdQaTJRcVF1TVEwS2FWbXJxcHc9PQ==--41330f50fd1c2bd4ac8eaac4a36ebfb1577be89b)](https://automate.browserstack.com/public-build/SG1sSFpJeUJ0M1pmY1hrM2F0dVNLclRPSzdCb3lLN253MzcrV0liZWd1bz0tLWxXQWdQaTJRcVF1TVEwS2FWbXJxcHc9PQ==--41330f50fd1c2bd4ac8eaac4a36ebfb1577be89b)
[![Deploy](https://github.com/OWASP/threat-dragon/actions/workflows/deploy.yaml/badge.svg)](https://github.com/OWASP/threat-dragon/actions/workflows/deploy.yaml)
[![GitHub license](https://img.shields.io/github/license/owasp/threat-dragon.svg)](LICENSE.txt)
[![CodeQL](https://github.com/OWASP/threat-dragon/workflows/CodeQL/badge.svg)](https://github.com/OWASP/threat-dragon/actions?query=workflow%3ACodeQL)

## Note to contributors: we are in the process of migrating from Vue 2 to Vue 3, and from veux to Pinia, so expect significant changes to the code

# OWASP Threat Dragon

[OWASP](https://www.owasp.org) Threat Dragon is a free, open-source, cross-platform threat modeling application.
It is used to draw threat modeling diagrams and to list threats for elements in the diagram.
[Mike Goodwin](https://github.com/mike-goodwin) created Threat Dragon as an open source community project
that provides an intuitive and accessible way to model threats.

Threat Dragon is designed to be accessible for various types of teams, with an emphasis on flexibility and simplicity.
It is an [OWASP Lab Project](https://owasp.org/www-project-threat-dragon/)
and follows the values and principles of the [threat modeling manifesto](https://www.threatmodelingmanifesto.org/).

## Try Threat Dragon
You can access the the latest version of Threat Dragon on [our website](https://www.threatdragon.com/#/)
and look through the [documentation pages](https://owasp.org/www-project-threat-dragon/docs-2/).

Also well worth watching the video provided by the
[OWASP Spotlight](https://www.youtube.com/playlist?list=PLUKo5k_oSrfOTl27gUmk2o-NBKvkTGw0T) series.

The [github release area](https://github.com/OWASP/threat-dragon/releases)
contains Threat Dragon from version 1.3 to the latest versions 2.x.
Previous releases are from Mike Goodwin's [original repository](https://github.com/mike-goodwin/owasp-threat-dragon-desktop/releases).

## About Threat Dragon
There is a good overview of
[threat modeling and risk assessment](https://owasp.org/www-community/Application_Threat_Modeling)
from OWASP, and this expands on what the Threat Dragon project aims for:

- ease of use and accessible
- designing a data flow diagram
- suggesting threats
- entering mitigations and counter measures

[Mike Goodwin](https://github.com/mike-goodwin) is the founder and creator of this project,
and this repository has been migrated from
Mike Goodwin's [original](https://github.com/mike-goodwin/owasp-threat-dragon)
which has the issues and pull requests from October 2015 up to June 2020.

Threat Dragon is [primarily a web application](https://github.com/OWASP/threat-dragon/releases),
with threat model files stored in GitHub. Over time other storage methods will become available.

There are [desktop versions](https://github.com/OWASP/threat-dragon/releases) of Threat Dragon
which store the threat model files on the local filesystem rather than in a repository.
You can [download installers](https://github.com/OWASP/threat-dragon/releases) for Windows, MacOS and Linux.

End user help is available for both the latest [version 2.x](https://owasp.org/www-project-threat-dragon/docs-2/)
and the previous [version 1.x](https://owasp.org/www-project-threat-dragon/docs-1/).

### Version 1.x maintenance mode
Threat Dragon was originally written using AngularJS version 1.x, and this version of Angular has reached end of life.
This means that versions 1.x of Threat Dragon are no longer actively maintained and versions 2.x were re-written to use Vue.js.

For more information on building/running version 1.x,
please see the [legacy-v1.x branch](https://github.com/OWASP/threat-dragon/tree/legacy-v1.x).

### Building version 2.x

Install [git](https://git-scm.com/downloads) and [node.js](https://nodejs.org/en/download/) -
which includes the node package manager npm - and then [Install pnpm](https://pnpm.io/installation)

Clone the repository using: `git clone https://github.com/owasp/threat-dragon.git`

This downloads the code into a `threat-dragon` directory and the application code is in two sub-folders,
one for the back-end application (`td.server`) and one for the front-end (`td.vue`).

Pnpm (rather than npm) is used to install from the top directory of the project : `pnpm install`

### Environment variables for web application
The web application variant of Threat Dragon requires some environment variables;
follow [the documentation](https://owasp.org/www-project-threat-dragon/docs-2/install-environment/)
on how to set these variables.

The Threat Dragon web application uses GitHub to store threat models,
so you need to go to your GitHub account and register it as a GitHub application.
There is a [step by step guide](https://owasp.org/www-project-threat-dragon/docs-2/install-environment/)
on how to do this. Github Enterprise is also supported.

If running the web application locally then the front-end to server communication will
probably need to be HTTP rather than HTTPS.
Specify this using environment variable `SERVER_API_PROTOCOL=http` in the dotenv file or the command line.

### Run the application

When running on Windows, and during development, the front-end and back-end
can be started separately in "watch" mode using commands : `pnpm dev:server` and `pnpm dev:vue`.
Alternatively, if running on Linux or MacOS, start both the back-end server and the front-end application
from the top directory using : `pnpm start`.

With both front and back end running, access with a browser at http://localhost:8080/

### Stop the application

If using `pnpm start`, stop both the back-end server and the front-end application
from the top directory with command `pnpm stop`. Otherwise break out of both the server and vue front-end.

### Docker (local build)

To run Threat Dragon in a docker container,
first configure your [environment using dotenv](https://owasp.org/www-project-threat-dragon/docs-2/install-environment/)
and run from the top directory of the project:

- `docker build -t owasp-threat-dragon:dev .`
- `docker run -it --rm -p 8080:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`
- or if using Windows:
- `docker run -it --rm -p 8080:3000 -v %CD%/.env:/app/.env owasp-threat-dragon:dev`

Using http port 8080 and accessing Threat Dragon on `http://localhost:8080/`.

## Docker (from dockerhub)

Threat Dragon maintains docker images within the OWASP organisation area on Dockerhub.
Each release is tagged as `v{major}.{minor}.{patch}`, eg `v1.6.0`:

- `docker pull owasp/threat-dragon:v2.0.0`

Do _not use the latest tag_ (which is the default), as it could be a development release.

Alternatively, you can use the `stable` tag, which will always be the latest official release:

- `docker pull threatdragon/owasp-threat-dragon:stable`
- For MacOS and Linux:
- `docker run -it --rm -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:v2.0.0`
- For Windows:
- `docker run -it --rm -p 8080:3000 -v %CD%/.env:/app/.env threatdragon/owasp-threat-dragon:v2.0.0`

Assuming that you are using http port 8080 and accessing Threat Dragon on `http://localhost:8080/`.

### Contributing

Pull requests, feature requests, bug reports and feedback of any kind are very welcome,
please refer to the page for [contributors](CONTRIBUTING.md).

There are some [developer notes](https://owasp.org/www-project-threat-dragon/docs-2/local-development/)
to help get started with this project.
We are trying to keep the test coverage relatively high so include tests in your pull requests.

### Vulnerability disclosure

If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority.
For secure disclosure, please see the [security policy](SECURITY.md).

### Project leaders

- Mike Goodwin (mike.goodwin@owasp.org)
- Jon Gadsden (jon.gadsden@owasp.org)
- Leo Reading (leo.reading@owasp.org)

_Threat Dragon: making threat modeling less threatening_

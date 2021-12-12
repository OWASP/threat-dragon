<p align="center">
  <img src="https://raw.githubusercontent.com/owasp/threat-dragon/main/td.site/src/content/images/threatdragon_logo_image.svg"
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

Threat Dragon is designed to be accessible for various types of teams, with an emphasis on flexibility and simplicity.
It is an [OWASP Lab Project](https://www.owasp.org/index.php/OWASP_Threat_Dragon)
and follows the values and principles of the [threat modeling manifesto](https://www.threatmodelingmanifesto.org/).

[Mike Goodwin](https://github.com/mike-goodwin) is the founder and creator of this project,
and this repository has been migrated from
Mike Goodwin's [original](https://github.com/mike-goodwin/owasp-threat-dragon)
which has the issues and pull requests from October 2015 up to June 2020.
Since then the project team has continued development, culminating with release version 1.6.0.
The project is now going through a substantial changes which will see version 2.0 released early 2022.

Threat Dragon is primarily a web application, with threat model files stored in GitHub.
Over time other storage methods will become available.

There is also a desktop version of Threat Dragon
which stores the threat model files on the local filesystem rather than in a repository.
Each release provides installers for both Windows, Mac OSX and Linux, as well as rpm and debian packages.

[End user help](https://docs.threatdragon.org) is available for both variants.

### Installing
Install git and node.js - which includes the node package manager npm.
To get the code navigate to a target directory and use command

`git clone --recursive https://github.com/owasp/threat-dragon.git`

This downloads the code into a `threat-dragon` directory and the application code is in two sub-folders,
one for the back-end application (`td.server`) and one for the front-end (`td.vue`).

To install from the top directory of the project: `npm install`

### Environment variables
Threat Dragon uses GitHub to store threat models, so you need to go to your GitHub account and
register it as a GitHub application. There is a 
[step by step guide](https://www.threatdragon.com/docs/development/env.html) on how to do this.

You will also have to provide other environment variables, again following
[the documentation](https://www.threatdragon.com/docs/development/env.html) on this

### Run the application
Start both the back-end server and the front-end application from the top directory: `npm start`

To stop the application and the back-end server, from the top directory: `npm run stop`

With both front and back end running, access with a browser at http://localhost:8080/ 

### Stop the application
Stop both the back-end server and the front-end application from the top directory: `npm stop`

### Docker
To run Threat Dragon in a docker container,
first configure your [environment using dotenv](https://www.threatdragon.com/docs/development/env.html)
and run from the top directory of the project:
- `docker build -t owasp-threat-dragon:dev .`
- `docker run -it --rm -p 8080:8080 -v $(pwd)/.env:/app/.env owasp-threat-dragon:dev`

### Contributing
Pull requests, feature requests, bug reports and feedback of any kind are very welcome, please refer to the page for
[contributors](CONTRIBUTING.md). 

We are trying to keep the test coverage relatively high,
so please try to update tests in any PRs and make PRs on the development branch.
There are some [developer notes](dev-notes.md) to help get started with this project.

### Vulnerability disclosure
If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority.
For secure disclosure, please see the [security policy](SECURITY.md).

### Project leaders
* Mike Goodwin (mike.goodwin@owasp.org)
* Jon Gadsden (jon.gadsden@owasp.org)
* Leo Reading (leo.reading@owasp.org)

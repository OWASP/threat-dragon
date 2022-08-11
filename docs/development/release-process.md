---
layout: page
title: Release Process
nav_order: 1
path: /release-process
group: Release-Process
---

# Release Process
The steps used during the release process

## Tag the release
1. `git clone git@github.com:OWASP/threat-dragon.git`
1. `cd threat-dragon`
1. update version declaration, eg `"version": "2.0.0",`, in `package.json`, `td.site/package.json` and `td.server/package.json`
1. `npm install`
1. `npm run build`
1. `npm test`
1. `git commit -a -m"<some release message>"`
1. `git push`
1. tag the release with appropriate subver `git tag v2.0.0`
1. `git push origin v2.0.0` 

### Publish docker image
1. once tagged the workflow pushes the docker image to docker hub 
1. check using `docker pull threatdragon/owasp-threat-dragon:v2.0.0`

Test the releases as above; ideally on all of Windows, linux and MacOS

All going well then update the release notes for the draft in the
[Threat Dragon release area](https://github.com/OWASP/threat-dragon/releases) and make public

Finally ensure Threat Dragon tweets the release on Twitter, and announces it on the OWASP slack channels

_Threat Dragon: making threat models less threatening_

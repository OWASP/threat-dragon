---
layout: page
title: Release Process
nav_order: 6
path: /release-process
group: Release-Process
---

# Release Process
The steps used during the release process

## Tag the release
1. `git clone git@github.com:OWASP/threat-dragon.git`
2. `cd threat-dragon`
3. update version declaration, eg `"version": "2.0.0",`, in `package.json`, `td.site/package.json` and `td.server/package.json`
4. `npm install`
5. `npm run build`
6. `npm test`
7. `git commit -a -m"<some release message>"`
8. `git push`
9. tag the release with appropriate subver `git tag v2.0.0`
10. `git push origin v2.0.0`

The github release workflow then creates the draft release and creates all the install images

### Publish docker image
1. once tagged, the github workflow pushes the docker image to docker hub 
2. check using `docker pull threatdragon/owasp-threat-dragon:v2.0.0`
3. on MacOS M1 this command may need to be used `docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.0.0`
4. Test this release; ideally on Windows, linux and MacOS

If the image tests corrrectly, promote the docker image from dockerhub `threatdragon/`
to dockerhub `OWASP/threat-dragon/v2.0.0`.
There is _no going back_ on this last step, so it is deliberately left as a manual task:

```
docker pull threatdragon/owasp-threat-dragon:v2.0.0
docker tag threatdragon/owasp-threat-dragon:v2.0.0 owasp/threat-dragon:v2.0.0
docker push owasp/threat-dragon:v2.0.0
```

### Update release notes
All going well then update the release notes for the draft in the
[Threat Dragon release area](https://github.com/OWASP/threat-dragon/releases) and make public

Finally ensure Threat Dragon announces it on the OWASP slack channels

_Threat Dragon: making threat models less threatening_

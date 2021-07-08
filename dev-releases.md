# Developer notes for [OWASP](https://www.owasp.org) [Threat Dragon](https://owasp.org/www-project-threat-dragon/) release process

## Create New Releases

This is a collection of recipes used during the release process

### Tag the release
1. create branch `release-ready` in [Threat Dragon repo](https://github.com/OWASP/threat-dragon)
1. `git clone git@github.com:OWASP/threat-dragon.git -b release-ready`
1. `cd threat-dragon`
1. update version declaration eg `"version": "1.4.0",` in `package.json`, `td.site/package.json` and `td.server/package.json`
1. `npm install`
1. `npm run pretest`
1. `npm run build`
1. `npm test`
1. `git commit -a -m"<some release message>"`
1. `git push`
1. merge branch in [webapp repo](https://github.com/OWASP/threat-dragon) and then checkout master:
1. `git clone git@github.com:OWASP/threat-dragon.git`
1. `cd threat-dragon`
1. `git tag v1.4.0`
1. `git push origin v1.4.0`

### Publish docker image
1. `docker build -t owasp-threat-dragon:v1.4.0 .`
1. `docker tag owasp-threat-dragon:v1.4.0 threatdragon/owasp-threat-dragon:v1.4.0`
1. `docker images`
1. `docker login` using docker credentials
1. `docker push threatdragon/owasp-threat-dragon:v1.4.0`
1. check using `docker pull threatdragon/owasp-threat-dragon:v1.4.0`

Test the release using 'Install and run web application' in [dev-notes.md], ideally on all of Windows, linux and MacOS.
In general if it works on one platform then it will work on the others, so one platform may be sufficient

### Desktop release area
1. ensure the release is tagged, see above
1. create the windows installer as below
1. create the linux installers as below
1. create the MacOS installer as below
1. draft the release in [Threat Dragon repo](https://github.com/OWASP/threat-dragon/releases) using release tag
1. add the release notes to this release
1. attach installer files to this release
1. list SHA256 for each installer file: `.exe`, `.dmg`, `.deb`, `.rpm`, `.snap` and `.AppImage`


### Windows installer for TD desktop
Create windows .exe and test it on a windows box
1. `git clone https://github.com/OWASP/threat-dragon.git`
1. `cd threat-dragon/td.desktop`
1. `npm install`
1. `npm run pretest`
1. `npm test`
1. `npm run build-win`
1. make sure the installer works, navigate to `.exe` and run
1. obtain SHA256 of .exe file using `shasum -a256`

### MacOS installer for TD desktop
Create MacOS .deb installer and test it on a mac
1. `git clone git@github.com:OWASP/threat-dragon.git`
1. `cd threat-dragon/td.desktop`
1. `npm install`
1. `npm run pretest`
1. `npm test`
1. `npm run build-osx`
1. make sure the installer works, navigate to .dmg and run
1. obtain SHA256 of .dmg file using `shasum -a256`

### Linux installers for TD desktop
Create linux .rpm, .deb .snap, AppImage and test them on a linux box
1. `git clone git@github.com:OWASP/threat-dragon.git`
1. `cd threat-dragon/td.desktop`
1. `npm install`
1. `npm run pretest`
1. `npm test`
1. `npm run build-lin`
1. make sure the installers work, navigate to `.deb` or `.rpm` package and test
1. test the Snap and AppImage ( `.snap` and `.AppImage`) files
1. obtain SHA256 of `.deb`, `.rpm`, `.snap` and `.AppImage` files using `shasum -a256`

_Threat Dragon: making threat models more dragony_

# Developer notes for [OWASP](https://www.owasp.org) [Threat Dragon](https://owasp.org/www-project-threat-dragon/) release process

## Create New Releases

This is a collection of recipes used during the release process

### Web app release
1. create branch `release-ready` in [webapp repo](https://github.com/OWASP/threat-dragon)
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

Test the release as in 'Install and run web application' above, ideally on all of Windows, linux and MacOS.
In general if it works on one platform then it will work on the others, so one platform may be sufficient

Keep Mike Goodwin's area up to date with this release from the OWASP area. For example with version 1.4.0:
1. Create branch `version-1.4.0` on https://github.com/mike-goodwin/owasp-threat-dragon.git
1. git clone git@github.com:mike-goodwin/owasp-threat-dragon.git -b version-1.4.0
1. cd owasp-threat-dragon/
1. git remote add upstream https://github.com/owasp/threat-dragon.git
1. git fetch upstream
1. git rebase upstream/main
1. git status
1. git push
1. create pull request from branch `version-1.4.0` on https://github.com/mike-goodwin/owasp-threat-dragon.git

### Tag the desktop release
1. create branch `release-ready` in [desktop repo](https://github.com/OWASP/threat-dragon-desktop)
1. `git clone git@github.com:OWASP/threat-dragon-desktop.git -b release-ready`
1. `cd threat-dragon-desktop`
1. update `package.json` version declaration to, eg `"version": "1.4.0",`
1. `npm install`
1. `npm run pretest`
1. `npm run build-content`
1. `npm test`
1. `git commit -a -m"<some release message>"`
1. `git push`
1. merge branch in [desktop repo](https://github.com/OWASP/threat-dragon-desktop) and then checkout master:
1. `git clone git@github.com:OWASP/threat-dragon-desktop.git`
1. `cd threat-dragon-desktop`
1. `git tag v1.4.0`
1. `git push origin v1.4.0`

### Windows installer for TD desktop
Create windows .exe and test it on a windows box
1. `git clone https://github.com/OWASP/threat-dragon-desktop.git`
1. `cd threat-dragon-desktop`
1. `npm install`
1. `npm run pretest`
1. `npm test`
1. `npm run build-win`
1. make sure the installer works, navigate to `.exe` and run
1. obtain SHA256 of .exe file using `shasum -a256`

### MacOS installer for TD desktop
Create MacOS .deb installer and test it on a mac
1. `git clone git@github.com:OWASP/threat-dragon-desktop.git`
1. `cd threat-dragon-desktop`
1. `npm install`
1. `npm run pretest`
1. `npm test`
1. `npm run build-osx`
1. make sure the installer works, navigate to .dmg and run
1. obtain SHA256 of .dmg file using `shasum -a256`

### Linux installers for TD desktop
Create linux .rpm, .deb .snap, AppImage and test them on a linux box
1. `git clone git@github.com:OWASP/threat-dragon-desktop.git`
1. `cd threat-dragon-desktop`
1. `npm install`
1. `npm run pretest`
1. `npm test`
1. `npm run build-lin`
1. make sure the installers work, navigate to .deb or .rpm package and test
1. test the Snap .snap and AppImage files
1. obtain SHA256 of .deb, .rpm, .snap and .AppImage files using `shasum -a256`

### TD desktop release
1. tag the desktop release, see above
1. create the windows installer as above
1. create the linux installers as above
1. create the MacOS installer as above
1. create the release in [OWASP desktop repo](https://github.com/OWASP/threat-dragon-desktop) using tag v1.4.0
1. add the release notes to this release
1. attach installer files to this release
1. list SHA256 for each installer file: .exe, .dmg, .deb, .rpm, .snap and .AppImage

Keep Mike Goodwin's area up to date with this release from the OWASP area. For example with version 1.4.0:
1. Create branch `version-1.4.0` on https://github.com/mike-goodwin/owasp-threat-dragon-desktop.git
1. git clone git@github.com:mike-goodwin/owasp-threat-dragon-desktop.git -b version-1.4.0
1. cd owasp-threat-dragon-desktop/
1. git remote add upstream https://github.com/owasp/threat-dragon-desktop.git
1. git fetch upstream
1. git rebase upstream/main
1. git status
1. git push
1. create pull request from branch `version-1.4.0` on https://github.com/mike-goodwin/owasp-threat-dragon-desktop.git

_Threat Dragon: making threat models more dragony_

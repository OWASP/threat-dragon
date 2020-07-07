## [OWASP](https://www.owasp.org) [Threat Dragon](https://owasp.org/www-project-threat-dragon/) ##

### Notes for developers ###

This is a collection of notes used during development, most of which should be up to date - if not then raise an issue.

#### Overview ####

Threat Dragon is a [node.js](https://nodejs.org)
[single page application](https://en.wikipedia.org/wiki/Single-page_application) built on [Angular](https://angular.io/)
framework. It comes in two variants, a web application and a desktop application, both variants use a common core.

The core repo, common to both the web app and the desktop app, is at: https://github.com/OWASP/threat-dragon-core

The desktop application repo, which relies on the core functions, is at: https://github.com/OWASP/threat-dragon-desktop

The web application repo, which also relies on the core functions, is at: https://github.com/OWASP/threat-dragon

Both application variants install `threat-dragon-core` as part of the install process `npm install`, under directory
`node-modules/owasp-threat-dragon-core`. This package is downloaded during install from the [npmjs registry](https://www.npmjs.com/) as the [owasp-threat-dragon-core](https://www.npmjs.com/package/owasp-threat-dragon-core) package.

#### Documentation, demo and dev websites ####
The public sites are updated from the orginal repo at https://github.com/mike-goodwin/owasp-threat-dragon .
These sites can only be updated by the admin of this repo, Mike Goodwin.
* merges to `master` branch will update online demo at https://threatdragon.org/
* merges to `development` branch will update snapshot at https://threatdragondev.azurewebsites.net/
* merges to `gh-pages` branch will update documentaion at https://docs.threatdragon.org/

* #### Install and run web application ####
Some [environment variables](https://github.com/OWASP/threat-dragon/blob/main/setup-env.md) need to be set up
for the webapp to run
```
~> git clone git@github.com:OWASP/threat-dragon.git
~> cd threat-dragon
~/threat-dragon> npm install
~/threat-dragon> npm run pretest
~/threat-dragon> npm run build
~/threat-dragon> npm test
~/threat-dragon> export GITHUB_CLIENT_ID=<the client id>
~/threat-dragon> export GITHUB_CLIENT_SECRET=<the client secret>
~/threat-dragon> export NODE_ENV=development
~/threat-dragon> export SESSION_STORE=local
~/threat-dragon> export SESSION_SIGNING_KEY=<32 char key>
~/threat-dragon> export SESSION_ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "<32 char key>"}]'
~/threat-dragon> npm run start
```
Navigate in a browser to http://localhost:3000/ to test the app

* #### Install and run desktop application ####
```
~> git clone git@github.com:OWASP/threat-dragon-desktop.git
~> cd threat-dragon-desktop
~/threat-dragon-desktop> npm install
~/threat-dragon-desktop> npm run pretest
~/threat-dragon-desktop> npm run build-content
~/threat-dragon-desktop> npm test
~/threat-dragon-desktop> npm run start
```

* #### Develop web application ####
Install:
```
git clone git@github.com:OWASP/threat-dragon.git -b your-dev-branch-name
cd threat-dragon
npm install
npm run pretest
npm run build
npm test
```
Make changes to code, and depending on the changes (eg .html or .css), `npm run build`

Run modified app with `npm run start`, and navigate in a browser to http://localhost:3000/

* #### Develop desktop application ####
Install:
```
git clone git@github.com:OWASP/threat-dragon-desktop.git -b your-dev-branch-name
cd threat-dragon-desktop
npm install
npm run pretest
npm run build-content
npm test
ln -sf node_modules/electron/cli.js electron
```
Make changes to code, and depending on the changes (eg .html or .css), `npm run build-content`

Run modified app with either `./electron . run -vv` or `npm run start`

* #### Develop core functions using web app ####
Install and build as before
```
~> git clone git@github.com:OWASP/threat-dragon.git
~> cd threat-dragon
~/threat-dragon> npm install
~/threat-dragon> npm run pretest
~/threat-dragon> npm run build
~/threat-dragon> npm test
```
Replace the TD core using:
```
~/threat-dragon> cd node_modules
~/threat-dragon/node_modules> rm -rf owasp-threat-dragon-core
~/threat-dragon/node_modules> git clone git@github.com:OWASP/threat-dragon-core.git owasp-threat-dragon-core
~/threat-dragon/node_modules> cd owasp-threat-dragon-core
~/threat-dragon/node_modules/owasp-threat-dragon-core> npm install
~/threat-dragon/node_modules/owasp-threat-dragon-core> npm run build
~/threat-dragon/node_modules/owasp-threat-dragon-core> npm run pretest
~/threat-dragon/node_modules/owasp-threat-dragon-core> npm test
```
Rebuild the webapp using the swapped in core package,
[setting environment variables](https://github.com/OWASP/threat-dragon/blob/main/setup-env.md) :
```
~/threat-dragon/node_modules/owasp-threat-dragon-core> cd ../..
~/threat-dragon> npm run build
~/threat-dragon> export GITHUB_CLIENT_ID=<the client id>
~/threat-dragon> export GITHUB_CLIENT_SECRET=<the client secret>
~/threat-dragon> export NODE_ENV=development
~/threat-dragon> export SESSION_STORE=local
~/threat-dragon> export SESSION_SIGNING_KEY=<32 char key>
~/threat-dragon> export SESSION_ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "<32 char key>"}]'
~/threat-dragon> npm run start
```
The webapp can now be run as normal and tested by navigating in a browser to http://localhost:3000/ .
If changes are made to the core files then (depending on the changes) need to rebuild using
command `npm run build` in core directory and then webapp directory:
```
~/threat-dragon> cd node_modules/owasp-threat-dragon-core
~/threat-dragon/node_modules/owasp-threat-dragon-core> npm run build
~/threat-dragon> cd -
~/threat-dragon> npm run build
~/threat-dragon> npm run start
```
* #### Develop core functions using desktop app ####
Install and build as before
```
~> git clone git@github.com:OWASP/threat-dragon-desktop.git
~> cd threat-dragon-desktop
~/threat-dragon-desktop> npm install
~/threat-dragon-desktop> npm run pretest
~/threat-dragon-desktop> npm run build-content
~/threat-dragon-desktop> npm test
```
Replace the TD core using:
```
~/threat-dragon-desktop> cd node_modules
~/threat-dragon-desktop/node_modules> rm -rf owasp-threat-dragon-core
~/threat-dragon-desktop/node_modules> git clone git@github.com:OWASP/threat-dragon-core.git owasp-threat-dragon-core
~/threat-dragon-desktop/node_modules> cd owasp-threat-dragon-core
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm install
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm run build
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm run pretest
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm test
```
Rebuild the desktop app using the swapped in core package:
```
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> cd ../..
~/threat-dragon-desktop> npm run build-content
~/threat-dragon-desktop> ln -sf node_modules/electron/cli.js electron
~/threat-dragon-desktop> ./electron . run --verbose
```
The desktop will run as before. If changes are made to the core files then (depending on the changes)
need to rebuild using command ` npm run build` in core directory and then
command ` npm run build-content` in desktop directory:
```
~/threat-dragon-desktop> cd node_modules/owasp-threat-dragon-core
~/threat-dragon-desktop/node_modules/owasp-threat-dragon-core> npm run build
~/threat-dragon-desktop> cd -
~/threat-dragon-desktop> npm run build-content
~/threat-dragon-desktop> ./electron . run --verbose
```
* #### Keep branches in sync ####
Say your fork or branch is out of sync with the main OWASP repo, usually some commits behind.
This example is for `threat-dragon-desktop` repo, but the same applies to `threat-dragon`
and `threat-dragon-core` repos:
```
git clone https://github.com/<YOUR-USER-NAME>/threat-dragon-desktop.git
cd threat-dragon-desktop
git remote add original https://github.com/OWASP/threat-dragon-desktop
git fetch original
```
Apply the changes with `git merge original/main` or `git rebase --no-ff original/main` .
When happy with _everything_ then `git push --force` to update your repo

* #### TD Core release ####
1. create branch `release-ready` in [core repo](https://github.com/OWASP/threat-dragon-core)
1. `git clone git@github.com:OWASP/threat-dragon-core.git -b release-ready`
1. `cd threat-dragon-core`
1. `npm install`
1. `npm run pretest`
1. `npm run build`
1. `npm test`
1. update `package.json` version declaration to `  "version": "1.3.0",`
1. `git commit -a -m"<some release message>"`
1. `git push`
1. merge branch in [core repo](https://github.com/OWASP/threat-dragon-core) and then checkout master:
1. `git clone git@github.com:OWASP/threat-dragon-core.git`
1. `cd threat-dragon-core`
1. `git tag v1.3`
1. `git push origin v1.3`
1. `npm install`
1. `npm run pretest`
1. `npm run build`
1. `npm test`
1. login to npm `npm login` using username, password and email address
1. update package on [npmjs registry](https://www.npmjs.com/) with `npm publish`
1. check that [owasp-threat-dragon-core](https://www.npmjs.com/package/owasp-threat-dragon-core) is at correct version

* #### Webapp release ####
1. create branch `release-ready` in [webapp repo](https://github.com/OWASP/threat-dragon)
1. `git clone git@github.com:OWASP/threat-dragon.git -b release-ready`
1. `cd threat-dragon`
1. `npm install`
1. `npm run pretest`
1. `npm run build`
1. `npm test`
1. update `package.json` version declaration to `  "version": "1.3.0",`
1. `git commit -a -m"<some release message>"`
1. `git push`
1. merge branch in [webapp repo](https://github.com/OWASP/threat-dragon) and then checkout master:
1. `git clone git@github.com:OWASP/threat-dragon.git`
1. `cd threat-dragon`
1. `git tag v1.3`
1. `git push origin v1.3`
Test the release as in 'Install and run web application' above, ideally on all of Windows, linux and MacOS.
In general if it works on one platform then it will work on the others, so one platform may be sufficient

* #### Tag the desktop release ####
1. create branch `release-ready` in [desktop repo](https://github.com/OWASP/threat-dragon-desktop)
1. `git clone git@github.com:OWASP/threat-dragon-desktop.git -b release-ready`
1. `cd threat-dragon-desktop`
1. `npm install`
1. `npm run pretest`
1. `npm run build-content`
1. `npm test`
1. update `package.json` version declaration to `  "version": "1.3.0",`
1. `git commit -a -m"<some release message>"`
1. `git push`
1. merge branch in [desktop repo](https://github.com/OWASP/threat-dragon-desktop) and then checkout master:
1. `git clone git@github.com:OWASP/threat-dragon-desktop.git`
1. `cd threat-dragon-desktop`
1. `git tag v1.3`
1. `git push origin v1.3`

* #### Windows installer for TD desktop ####
Create windows .exe and test it on a windows box
1. `git clone git@github.com:OWASP/threat-dragon-desktop.git`
1. `cd threat-dragon-desktop`
1. `npm install`
1. make sure `node-modules/owasp-threat-dragon-core/package.json` is at correct version
1. `npm run pretest`
1. `npm test`
1. `npm run build-win`
1. make sure the installer works, navigate to `.exe` and run

* #### Linux installers for TD desktop ####
Create linux .rpm, .deb .snap, AppImage and test them on a linux box
1. `git clone git@github.com:OWASP/threat-dragon-desktop.git`
1. `cd threat-dragon-desktop`
1. `npm install`
1. make sure `node-modules/owasp-threat-dragon-core/package.json` is at correct version
1. `npm run pretest`
1. `npm test`
1. `npm run build-lin`
1. make sure the installers work
1. navigate to .deb package and run
1. navigate to Snap .snap file and run
1. navigate to AppImage file and run

* #### MacOS installer for TD desktop ####
Create MscOS .deb installer and test it on a mac
1. `git clone git@github.com:OWASP/threat-dragon-desktop.git`
1. `cd threat-dragon-desktop`
1. `npm install`
1. make sure `node-modules/owasp-threat-dragon-core/package.json` is at correct version
1. `npm run pretest`
1. `npm test`
1. `** `npm run build-osx`
1. make sure the installer works, navigate to .dmg and run

* #### TD desktop release ####
1. tag the desktop release, see above
1. create the windows installer as above
1. create the linux installers as above
1. create the MacOS installer as above
1. create ther release in [OWASP desktop repo](https://github.com/OWASP/threat-dragon-desktop) using tag v1.3
1. add the release notes to this release
1. attach installer files to this release

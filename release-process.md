The steps used during the release process, including release candidates

## Create release candidate

Before a release it is required that a release candidate version is created.
This allows the Threat Dragon community to review and feedback on the proposed release.
Changes that are agreed for the release should then be made available with a further release candidate.

For example if RC1, but change for RC2 and so on :

1. `git clone git@github.com:OWASP/threat-dragon.git`
2. `cd threat-dragon`
3. update version, for example `"version": "2.3.0",`, in `td.vue/package.json`
4. ensure `buildState` in `td.vue/package.json` is `-RC1`
5. update version, for example `"version": "2.3.0-RC1",`, in `package.json` and `td.server/package.json`
6. update package lock files: `npm install`
7. `npm run build`
8. `npm test`
9. `npm run test:vue`
10. ensure that the package-lock files are up to date using `npm install`
11. `git add --all; git status`
12. `git commit -m"release version 2.3.0-RC1"`
13. `git push`
14. tag the release `git tag v2.3.0-RC1`
15. `git push origin v2.3.0-RC1`

repeat as necessary for further release candidates.

The github release workflow will then create the release candidate along with the install images

Ensure the release candidate is announced on the [OWASP Threat Dragon][td-slack] slack channel
and any other relevant channels

## Tag the release

After the releases candidate has been agreed by the Threat Dragon community, a release version can be prepared:

1. `git clone git@github.com:OWASP/threat-dragon.git`
2. `cd threat-dragon`
3. update version eg `"version": "2.3.0",`, in `package.json`, `td.vue/package.json` and `td.server/package.json`
4. update `buildState` in `td.vue/package.json` away from `-latest` to ''
5. update package lock files: `npm install`
6. `npm run build`
7. `npm test`
8. `npm run test:vue`
9. ensure that the package-lock files are up to date using `npm install`
10. `git add --all; git status`
11. `git commit -m"release version 2.3.0"`
12. `git push`
13. tag the release `git tag v2.3.0`
14. `git push origin v2.3.0`

The github release workflow then creates the draft release and the install images

### Publish docker image

1. once tagged, the github workflow pushes the docker image to docker hub
2. check using `docker pull threatdragon/owasp-threat-dragon:v2.3.0`
3. Test using the command to run a detached container:
    `docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:v2.3.0`
4. Ideally test this release on Windows, linux and MacOS using `http://localhost:8080/#/`

If the image tests correctly, promote the docker image
from dockerhub `threatdragon/` to dockerhub `OWASP/threat-dragon/v2.3.0`.

There is _no going back_ on this last step, so it is deliberately left as a manual task:

```text
docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.3.0
docker tag threatdragon/owasp-threat-dragon:v2.3.0 owasp/threat-dragon:v2.3.0
docker push owasp/threat-dragon:v2.3.0
docker pull owasp/threat-dragon:v2.3.0
docker tag owasp/threat-dragon:v2.3.0 owasp/threat-dragon:stable
docker push owasp/threat-dragon:stable
```

ensure the tag now exists within the OWASP Docker hub: `https://hub.docker.com/r/owasp/threat-dragon/tags`

### Check demo site

1. Install [Heroku CLI tools][herokucli] if necessary
2. Login to [Heroku][heroku]
3. Inspect logs using `heroku logs --app=threatdragon-v2 --tail`
4. Ensure no rollback shown in [dashboard][herokudash]

### Check desktop downloads

- Download desktop AppImage for Linux and installers for MacOS `.dmg` and Windows `.exe`
- Download the `latest*.yml` auto-update checksum files
- Create SHA512 `checksum*.yml` files:

 ```text
grep sha512 latest-linux.yml | head -n 2 | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' >> checksum-linux.yml
grep sha512 latest.yml | head -n 2 | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' >> checksum.yml
grep sha512 latest-mac.yml | head -n 3 | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' >> checksum-mac.yml
grep sha512 latest-mac.yml | head -n 4 | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' >> checksum-mac-arm64.yml
```

- Confirm SHA512 with:

```text
echo "$(cat checksum-linux.yml) Threat-Dragon-ng-2.3.0.AppImage" | sha512sum --check
echo "$(cat checksum-mac.yml) Threat-Dragon-ng-2.3.0.dmg" | sha512sum --check
echo "$(cat checksum-mac-arm64.yml) Threat-Dragon-ng-2.3.0-arm64.dmg" | sha512sum --check
echo "$(cat checksum.yml) Threat-Dragon-ng-Setup-2.3.0.exe" | sha512sum --check
```

- upload `checksum*.yml` files

### Update release notes

Before adding text to the draft release, click on 'Generate Release Notes' button from the edit window.
If this is done after text is added it does not work.
Edit the 'What's Changed' to filter out any chores.

Then update the release notes for the draft in the [Threat Dragon release area][area]
using the release notes using markdown provided by `.release-note-template.md` as a template,
making sure to revise `2.x.x` to the correct version number such as `2.3.0`

Promote the release from draft to public once everything is in place

### Announce

Update the [releases tab][releases] and the [info pane][td-info] on the OWASP Threat Dragon project pages.

Finally ensure Threat Dragon announces the new release on the [OWASP Threat Dragon][td-slack] slack channel
and any other relevant channels

### Manually notarize / staple for MacOS images

It used to be that [altool][altool] could be used to notarize the MacOS `.dmg` files in the pipeline.
As of early 2024 this is no longer available and [notarytool][notarize] must be used in a secure environment.
Used in [the pipeline][notarytool], it can also be done/checked manually:

- Download both x86 and arm64 images for the MacOS installer (`*.dmg`)
- ensure that the apple developer [environment is set up][notarize]
- notarize and staple, for example with version 2.3.0:
  - `xcrun notarytool submit --apple-id <apple-account-email> --team-id <teamid> \`
    `--password <password> --verbose --wait Threat-Dragon-ng-2.3.0-arm64.dmg`
  - `xcrun stapler staple --verbose Threat-Dragon-ng-2.3.0-arm64.dmg`
- similarly for the x86 image `Threat-Dragon-ng-2.3.0.dmg`

### Manually check Snap images

https://snapcraft.io/install/threat-dragon/arch
https://login.ubuntu.com/

Full name: Threat Dragon
username: threat-dragon
`snapcraft login` using email: jon.gadsden@owasp.org and Ubuntu One password?

Token used in the Threat Dragon pipeline as 'SNAPCRAFT_TOKEN', use command to refresh creds:
`snapcraft export-login --snaps threat-dragon --channels stable`

[altool]: https://successfulsoftware.net/2023/04/28/moving-from-altool-to-notarytool-for-mac-notarization/
[area]: https://github.com/OWASP/threat-dragon/releases
[heroku]: https://id.heroku.com/login
[herokucli]: https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli
[herokudash]: https://dashboard.heroku.com/apps
[notarize]: https://developer.apple.com/documentation/security/resolving-common-notarization-issues
[notarytool]: https://www.electron.build/app-builder-lib.interface.macconfiguration#notarize
[releases]: https://github.com/OWASP/www-project-threat-dragon/blob/main/tab_releases.md
[td-info]: https://github.com/OWASP/www-project-threat-dragon/blob/main/info.md
[td-slack]: https://owasp.slack.com/messages/CURE8PQ68

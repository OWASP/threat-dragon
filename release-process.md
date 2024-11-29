The steps used during the release process, including release candidates

## Create release candidate

Before a release it is required that a release candidate version is created.
This allows the Threat Dragon community to review and feedback on the proposed release.
Changes that are agreed for the release should then be made available with a further release candidate.

For example if RC1, but change for RC2 and so on :

1. `git clone git@github.com:OWASP/threat-dragon.git`
2. `cd threat-dragon`
3. update version, for example `"version": "2.3.0-RC1",`, in `td.vue/package.json`
4. ensure `buildState` in `td.vue/package.json` is "" (empty)
5. update version, for example `"version": "2.3.0-RC1",`, in `package.json` and `td.server/package.json`
6. update package lock files: `npm install`
7. `npm run build`
8. `npm test`
9. `npm run test:vue`
10. ensure that the package-lock files are up to date using `npm install`
11. `git add --all; git status`
12. `git commit -m"release candidate 2.3.0-RC1"`
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
4. update `buildState` in `td.vue/package.json` away from `-latest` to "" (empty)
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

Ensure the tag now exists on the [Threat Dragon Docker hub]tddock].

1. once tagged, the github workflow pushes the docker image to docker hub
2. pull image for an X86 platform using `docker pull threatdragon/owasp-threat-dragon:v2.3.0`
3. pull image for an ARM platform using `docker pull threatdragon/owasp-threat-dragon:v2.3.0-arm64`
4. Test using the command to run a detached container:
    `docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:v2.3.0`
5. Test the ARM container as well:
    `docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:v2.3.0-arm64`
6. Ideally test these releases on Windows, linux and MacOS using `http://localhost:8080/#/`

If the image tests correctly, promote the docker image from dockerhub `threatdragon/`
to dockerhub `OWASP/threat-dragon/v2.3.0` and `OWASP/threat-dragon/v2.3.0-arm64`.

There is _no going back_ on these steps, so they are deliberately left as manual tasks:

```text
docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.3.0
docker tag threatdragon/owasp-threat-dragon:v2.3.0 owasp/threat-dragon:v2.3.0
docker push owasp/threat-dragon:v2.3.0
docker pull owasp/threat-dragon:v2.3.0
docker tag owasp/threat-dragon:v2.3.0 owasp/threat-dragon:stable
docker push owasp/threat-dragon:stable
docker pull --platform linux/arm64 threatdragon/owasp-threat-dragon:v2.3.0-arm64
docker tag threatdragon/owasp-threat-dragon:v2.3.0-arm64 owasp/threat-dragon:v2.3.0-arm64
docker push owasp/threat-dragon:v2.3.0-arm64
```

ensure the tag now exists within the [OWASP Docker hub][owaspdock].

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
grep sha512 latest-linux.yml | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' > checksum-linux.yml
grep sha512 latest.yml | head -n 2 | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' > checksum.yml
grep sha512 latest-mac.yml | head -n 3 | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' > checksum-mac.yml
grep sha512 latest-mac.yml | head -n 4 | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' > checksum-mac-arm64.yml
```

- Confirm SHA512 with:

```text
echo "$(cat checksum-linux.yml) Threat-Dragon-ng-2.3.0.AppImage" | sha512sum --check
echo "$(cat checksum-mac.yml) Threat-Dragon-ng-2.3.0.dmg" | sha512sum --check
echo "$(cat checksum-mac-arm64.yml) Threat-Dragon-ng-2.3.0-arm64.dmg" | sha512sum --check
echo "$(cat checksum.yml) Threat-Dragon-ng-Setup-2.3.0.exe" | sha512sum --check
```

Upload `checksum*.yml` files to the draft release.

### Manually notarize / staple for MacOS images

It used to be that [altool][altool] could be used to notarize the MacOS `.dmg` files in the pipeline.
As of early 2024 this is no longer available and [notarytool][notarytool] must be used in a secure environment.
The secrets for both signing and notarization can be checked by running it manually from the command line:

- provide the [code signing certs for MacOS][certs]
- Download both x86 and arm64 files for the MacOS installer (`*.dmg` and `*.zip`)
- ensure that the apple developer [environment is set up][notarize]
- notarize and staple the `.dmg` file, for example with arm64 version 2.3.0:
  - `xcrun notarytool submit --apple-id <apple-account-email> --team-id <teamid> \`
    `--password <password> --verbose --wait Threat-Dragon-ng-2.3.0-arm64.dmg`
  - `xcrun stapler staple --verbose Threat-Dragon-ng-2.3.0-arm64.dmg`
- similarly for the x86 image `Threat-Dragon-ng-2.3.0.dmg`
- notarize the application in the`.zip` file, for example with arm64 version 2.3.0:
  - `xcrun notarytool submit --apple-id <apple-account-email> --team-id <teamid> \`
    `--password <password> --verbose --wait Threat-Dragon-ng-2.3.0-arm64-mac.zip`
  - unzip the file to obtainn the application directory `Threat-Dragon-ng.app`
  - check notarization worked with: `spctl -a -v Threat-Dragon-ng.app`
  - staple the applications with: `xcrun stapler staple --verbose Threat-Dragon-ng.app`
  - zip the application directory to get `Threat-Dragon-ng.zip`
  - rename `Threat-Dragon-ng.zip` to `Threat-Dragon-ng-2.3.0-arm64-mac.zip`
- similarly for the x86 application `Threat-Dragon-ng-2.3.0-mac.zip`

Fix up the checksums in `latest-mac.yml` using values using script:

```text
echo -n "  - url: Threat-Dragon-ng-2.3.0-mac.zip\n    sha512: "
openssl dgst -binary -sha512 Threat-Dragon-ng-2.3.0-mac.zip | openssl base64 -A
echo -n "\n    size: "
ls -l Threat-Dragon-ng-2.3.0-mac.zip | cut -d " " -f 7
echo -n "\n  - url: Threat-Dragon-ng-2.3.0-arm64-mac.zip\n    sha512: "
openssl dgst -binary -sha512 Threat-Dragon-ng-2.3.0-arm64-mac.zip | openssl base64 -A
echo -n "\n    size: "
ls -l Threat-Dragon-ng-2.3.0-arm64-mac.zip | cut -d " " -f 7
echo -n "\n  - url: Threat-Dragon-ng-2.3.0.dmg\n    sha512: "
openssl dgst -binary -sha512 Threat-Dragon-ng-2.3.0.dmg | openssl base64 -A
echo -n "\n    size: "
ls -l Threat-Dragon-ng-2.3.0.dmg | cut -d " " -f 7
echo -n "\n  - url: Threat-Dragon-ng-2.3.0-arm64.dmg\n    sha512: "
openssl dgst -binary -sha512 Threat-Dragon-ng-2.3.0-arm64.dmg | openssl base64 -A
echo -n "\n    size: "
ls -l Threat-Dragon-ng-2.3.0-arm64.dmg | cut -d " " -f 7
```

Create the checksum files:

- `sha512sum Threat-Dragon-ng-2.3.0.dmg | cut -d " " -f 1 > checksum-mac.yml`
- `sha512sum Threat-Dragon-ng-2.3.0-arm64.dmg | cut -d " " -f 1 > checksum-mac-arm64.yml`

upload files into the new release

### Check Snap images

Ensure that Threat Dragon is updated on [Snapcraft][snapcraft].
This is also accessible using [Ubuntu One][ubuntu], check the release is current on the [dashboard][snapdash].

Token used in the Threat Dragon release pipeline is 'SNAPCRAFT_TOKEN' and this has to be refreshed annually.
Use commands to refresh creds:

* `snapcraft login`
* `snapcraft export-login --snaps threat-dragon --channels stable`

The snapcraft username is 'threat-dragon' and it has an Ubuntu One password.

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
and any other relevant channels such as [Blue Sky](https://bsky.app/profile/threatdragon.bsky.social)

### Tidy up

Reset the build state to 'latest'; this is displayed on the demo site:

1. update `buildState` in `td.vue/package.json` away from "" to `-latest`
2. update package lock files: `npm install`
3. ensure that the package-lock files are up to date using `npm install`
4. `git add --all; git status`
5. `git commit -m"set latest build version"`
6. `git push`

[altool]: https://successfulsoftware.net/2023/04/28/moving-from-altool-to-notarytool-for-mac-notarization/
[area]: https://github.com/OWASP/threat-dragon/releases
[certs]: https://federicoterzi.com/blog/automatic-code-signing-and-notarization-for-macos-apps-using-github-actions/
[heroku]: https://id.heroku.com/login
[herokucli]: https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli
[herokudash]: https://dashboard.heroku.com/apps
[notarize]: https://developer.apple.com/documentation/security/resolving-common-notarization-issues
[notarytool]: https://www.electron.build/app-builder-lib.interface.macconfiguration#notarize
[owaspdock]: https://hub.docker.com/r/owasp/threat-dragon/tags
[releases]: https://github.com/OWASP/www-project-threat-dragon/blob/main/tab_releases.md
[snapcraft]: https://snapcraft.io/install/threat-dragon/arch
[snapdash]: https://snapcraft.io/threat-dragon/releases
[td-info]: https://github.com/OWASP/www-project-threat-dragon/blob/main/info.md
[td-slack]: https://owasp.slack.com/messages/CURE8PQ68
[ubuntu]: https://login.ubuntu.com/

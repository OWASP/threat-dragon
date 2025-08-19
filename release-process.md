The steps used during the release process, including release candidates

Note that the build process will not run if the version is only Major.Minor, for example 2.5,
and it needs to be in form Major.Minor.Patch, for example 2.5.0

## Create release candidate

Before a release it is required that a release candidate version is created.
This allows the Threat Dragon community to review and feedback on the proposed release.
Changes that are agreed for the release should then be made available with a further release candidate.

For example if RC1, but change for RC2 and so on :

1. `git clone git@github.com:OWASP/threat-dragon.git`
2. `cd threat-dragon`
3. update version, for example `"version": "2.5.0-RC1",`, in `td.vue/package.json`
4. ensure `buildState` in `td.vue/package.json` is "" (empty)
5. update version, for example `"version": "2.5.0-RC1",`, in `package.json` and `td.server/package.json`
6. update package lock files: `npm install`
7. `npm run build`
8. `npm test`
9. `npm run test:vue`
10. ensure that the package-lock files are up to date using `npm install`
11. `git add --all; git status`
12. `git commit -m"release candidate 2.5.0-RC1"; git status`
13. `git push`
14. tag the release `git tag v2.5.0-RC1`
15. `git push origin v2.5.0-RC1`
16. `git status`

repeat as necessary for further release candidates.

The github release workflow will then create the release candidate along with the install images

Ensure the release candidate is announced on the [OWASP Threat Dragon][td-slack] slack channel
and any other relevant channels

Reset the build state to 'latest'; this is displayed on the demo site:

1. revert `buildState` in `td.vue/package.json` back to `-latest`
2. revert version, for example `"version": "2.5.0",`, in `td.vue/package.json`,
    in `package.json` and `td.server/package.json`
3. ensure that the package-lock files are up to date using `npm install`
4. `git add --all; git status`
5. `git commit -m"set build version back to latest"`
6. `git push`

## Create the release

### Tag the release

After the releases candidate has been agreed by the Threat Dragon community, a release version can be prepared:

1. `git clone git@github.com:OWASP/threat-dragon.git`
2. `cd threat-dragon`
3. update version eg `"version": "2.5.0",`, in `package.json`, `td.vue/package.json` and `td.server/package.json`
4. update `buildState` in `td.vue/package.json` away from `"-latest"` to `""` (empty)
5. update package lock files: `npm install`
6. `npm run build`
7. `npm test`
8. `npm run test:vue`
9. ensure documentation is clean: `pyspelling --config .spellcheck.yaml` and `markdownlint-cli2  docs/**/*.md`
10. update the version in `title:` for the docs in file `docs/_config.yml`
11. ensure all package-lock files are up to date using `npm install`
12. `git add --all; git status`
13. `git commit -m"release version 2.5.0"`
14. `git push` and wait for commit pipeline actions to complete
15. tag the release `git tag v2.5.0`
16. `git push origin v2.5.0`

The github release workflow automatically creates the draft release and the install images

### Publish docker image

Ensure the tag now exists within the [Threat Dragon Docker hub][td-dock].
Do this after logging into an active Docker account using `docker login` from the CLI and running Docker Desktop.

1. once tagged, the github workflow pushes the docker image to docker hub
2. pull image for an X86 platform using `docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.5.0`
3. pull image for an ARM platform using `docker pull --platform linux/arm64 threatdragon/owasp-threat-dragon:v2.5.0-arm64`
4. Test using the command to run a detached container:
    `docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:v2.5.0`
5. Test the ARM container as well:
    `docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:v2.5.0-arm64`
6. Ideally test these releases on Windows, linux and MacOS using `http://localhost:8080/#/`

If the image tests correctly, promote the docker image from dockerhub `threatdragon/`
to dockerhub `OWASP/threat-dragon/v2.5.0` and `OWASP/threat-dragon/v2.5.0-arm64`.

There is _no going back_ on these steps, so they are deliberately left as manual tasks:

```text
docker tag owasp/threat-dragon:v2.5.0 owasp/threat-dragon:stable
docker push owasp/threat-dragon:stable
docker pull owasp/threat-dragon:stable

docker pull --platform linux/arm64 threatdragon/owasp-threat-dragon:v2.5.0-arm64
docker tag threatdragon/owasp-threat-dragon:v2.5.0-arm64 owasp/threat-dragon:v2.5.0-arm64
docker push owasp/threat-dragon:v2.5.0-arm64
docker pull owasp/threat-dragon:v2.5.0-arm64

docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.5.0
docker tag threatdragon/owasp-threat-dragon:v2.5.0 owasp/threat-dragon:v2.5.0
docker push owasp/threat-dragon:v2.5.0
docker pull owasp/threat-dragon:v2.5.0
```

Ensure the tag now exists within the [OWASP Docker hub][owasp-dock].
Do the (x86_64) `v2.5.0` last so that is shown as the latest one

### Check demo site

1. Install [Heroku CLI tools][herokucli] if necessary
2. Login to [Heroku][heroku]
3. Inspect logs using `heroku logs --app=threatdragon-v2 --tail`
4. Ensure no rollback shown in [dashboard][herokudash]
5. Observe correct version running for the [Heroku app][herokuapp]
6. Check correct version for the [demo site][demo]

### Checksum for Linux desktop AppImage

Download desktop AppImage for Linux `Threat-Dragon-ng-2.5.0.AppImage` and the `latest-linux.yml` auto-update checksum file.

Create SHA512 `checksum-linux.yml` file:

 ```bash
grep sha512 latest-linux.yml | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' > checksum-linux.yml
echo -n " Threat-Dragon-ng-2.5.0.AppImage" >> checksum-linux.yml
```

Check correct using: `sha512sum --check checksum-linux.yml`
and upload `checksum-linux.yml` file to the release area.

### Check Snap images

Ensure that Threat Dragon is updated on [Snapcraft][snapcraft],
also accessible using [Ubuntu One][ubuntu].

Check the release is current on the [dashboard][snapdash],
if necessary use the dashboard to promote the latest release to 'stable'.

The token used in the Threat Dragon release pipeline is 'SNAPCRAFT_TOKEN' and this has to be refreshed annually.
Use commands to refresh creds:

- `snapcraft login`
- `snapcraft export-login --snaps threat-dragon --channels edge,latest,stable -` (note the dash for print to stdout)

The snapcraft username is 'threat-dragon' and uses an Ubuntu One password.

### Manually notarize / staple for MacOS images

It used to be that [altool][altool] could be used to notarize the MacOS `.dmg` files in the pipeline.
As of early 2024 this is no longer available and notarytool must be used in a secure environment.
The secrets for both signing and notarization can be checked by running it manually from the command line:

- provide the [code signing certs for MacOS][certs]
- Download both x86 and arm64 files for the MacOS installer (`*.dmg` and `*.zip`)
- ensure that the apple developer [environment is set up][notarize]
- notarize and staple the `Threat-Dragon-ng-2.x.x-arm64.dmg` file for arm64, using version 2.5.0 as an example:
  - `xcrun notarytool submit --apple-id <apple-account-email> --team-id <teamid> \`
    `--password <password> --verbose --wait Threat-Dragon-ng-2.5.0-arm64.dmg`
  - `xcrun stapler staple --verbose Threat-Dragon-ng-2.5.0-arm64.dmg`
- similarly for the x86 image `Threat-Dragon-ng-2.x.x.dmg` :
  - `xcrun notarytool submit --apple-id <apple-account-email> --team-id <teamid> \`
    `--password <password> --verbose --wait Threat-Dragon-ng-2.5.0.dmg`
  - `xcrun stapler staple --verbose Threat-Dragon-ng-2.5.0.dmg`
- notarize the application in both`.zip` files, for example using version 2.5.0:
  - `xcrun notarytool submit --apple-id <apple-account-email> --team-id <teamid> \`
    `--password <password> --verbose --wait Threat-Dragon-ng-2.5.0-arm64-mac.zip`
  - unzip the file to obtain the application directory `Threat-Dragon-ng.app`
  - check notarization worked: `spctl -a -v Threat-Dragon-ng.app`
  - staple the application: `xcrun stapler staple --verbose Threat-Dragon-ng.app`
  - zip the application directory to get: `Threat-Dragon-ng.zip`
  - rename `Threat-Dragon-ng.zip` to update `Threat-Dragon-ng-2.5.0-arm64-mac.zip`
- similarly for the x86 application `zip` file :
  - `xcrun notarytool submit --apple-id <apple-account-email> --team-id <teamid> \`
    `--password <password> --verbose --wait Threat-Dragon-ng-2.5.0-mac.zip`
  - unzip the file to obtain the application directory `Threat-Dragon-ng.app`
  - check notarization worked: `spctl -a -v Threat-Dragon-ng.app`
  - staple the application: `xcrun stapler staple --verbose Threat-Dragon-ng.app`
  - zip the application directory to get: `Threat-Dragon-ng.zip`
  - rename `Threat-Dragon-ng.zip` to update `Threat-Dragon-ng-2.5.0-mac.zip`

Fix up the checksums in `latest-mac.yml` values using script:

```bash
openssl dgst -binary -sha512 Threat-Dragon-ng-2.5.0-mac.zip | openssl base64 -A
ls -l Threat-Dragon-ng-2.5.0-mac.zip

openssl dgst -binary -sha512 Threat-Dragon-ng-2.5.0-arm64-mac.zip | openssl base64 -A
ls -l Threat-Dragon-ng-2.5.0-arm64-mac.zip

openssl dgst -binary -sha512 Threat-Dragon-ng-2.5.0.dmg | openssl base64 -A
ls -l Threat-Dragon-ng-2.5.0.dmg

openssl dgst -binary -sha512 Threat-Dragon-ng-2.5.0-arm64.dmg | openssl base64 -A
ls -l Threat-Dragon-ng-2.5.0-arm64.dmg
```

Create the checksum files:

- `sha512sum Threat-Dragon-ng-2.5.0.dmg > checksum-mac.yml`
- `sha512sum Threat-Dragon-ng-2.5.0-arm64.dmg > checksum-mac-arm64.yml`

Upload files into the new release:

- `Threat-Dragon-ng-2.5.0-mac.zip`
- `Threat-Dragon-ng-2.5.0-arm64-mac.zip`
- `Threat-Dragon-ng-2.5.0.dmg`
- `Threat-Dragon-ng-2.5.0-arm64.dmg`
- `checksum-mac.yml`
- `checksum-mac-arm64.yml`
- `latest-mac.yml`

Note that the original files of the same name need to be removed first.

### Code sign Windows installer

If the certificate needs to be provided in Base64 :

```text
openssl pkcs12 -export -in WINDOWS_OSS_CERT.pem -nokeys -out WINDOWS_OSS_CERT.p12 -passout pass:<password>
openssl pkcs12 -info -in  WINDOWS_OSS_CERT.p12 -passin pass:<password>
base64 -i WINDOWS_OSS_CERT.p12 -o WINDOWS_OSS_CERT.p12.b64
```

The use of the pipeline for code signing is not practical for this open source project
because of the need for a private key in the keychain, so use the certificate issuer's utilities.

The latest certificate is provided using Certum's Open Source certificate:

1. install [proCertum SmartSign + SimplySign Desktop for personal computers][smartsign]
2. use as a general reference Certum’s [Code Signing in the Cloud][certum]
3. download the unsigned windows installer file
4. ensure Powershell has the `signtool` utility installed from Windows SDK
5. right click the icon in the desktop tray to select ‘Connect to SimplySign’
6. gain a thumbprint from desktop tray icon, Manage certificates → Certificate list → Details → Thumbprint
7. `signtool sign /sha1 "<thumbprint>" /tr http://time.certum.pl /td sha256 /fd sha256 /v "Threat-Dragon-ng-Setup-2.5.0.exe"`

Once signed create the checksum file: `sha512sum Threat-Dragon-ng-Setup-2.5.0.exe > checksum.yml`

Fix up the file `latest.yml` with the correct size and the SHA256 value given by:

- `openssl dgst -binary -sha512 Threat-Dragon-ng-Setup-2.5.0.exe | openssl base64 -A`

Upload files `Threat-Dragon-ng-Setup-2.5.0.exe`, `checksum.yml` and `latest.yml` into the new release.
Note that the original files of the same name need to be removed first.

### Confirm desktop checksums

Confirm SHA512 with:

```text
sha512sum --check checksum-linux.yml
sha512sum --check checksum.yml
sha512sum --check checksum-mac.yml
sha512sum --check checksum-mac-arm64.yml
```

Upload `checksum*.yml` files to the draft release.

### Update release notes

Before adding text to the draft release, click on 'Generate Release Notes' button from the edit window.
If this is done after text is added it does not work.
Edit the 'What's Changed' to filter out any chores.

Then update the release notes for the draft in the [Threat Dragon release area][area]
using the release notes using markdown provided by `.release-note-template.md` as a template,
making sure to revise `2.x.x` to the correct version number such as `2.5.0`

Once everything is in place promote the release from 'draft' to 'public' and 'latest'

### Announce

Update the [releases tab][releases] and the [info pane][td-info] on the OWASP Threat Dragon project pages.

Finally ensure Threat Dragon announces the new release on the [OWASP Threat Dragon][td-slack] slack channel
and any other relevant channels such as [Blue Sky](https://bsky.app/profile/threatdragon.bsky.social)

### Tidy up

Revert the build state back to 'latest'; this build state is displayed on the demo site:

1. update `buildState` in `td.vue/package.json` from "" to `-latest`
2. ensure that the package-lock files are up to date using `npm install`
3. `git add --all; git status`
4. `git commit -m"set build version to latest"`
5. `git push`

[altool]: https://successfulsoftware.net/2023/04/28/moving-from-altool-to-notarytool-for-mac-notarization/
[area]: https://github.com/OWASP/threat-dragon/releases
[certs]: https://federicoterzi.com/blog/automatic-code-signing-and-notarization-for-macos-apps-using-github-actions/
[certum]: https://files.certum.eu/documents/manual_en/CS-Code_Signing_in_the_Cloud_Signtool_jarsigner_signing.pdf
[demo]: https://www.threatdragon.com/#/
[heroku]: https://id.heroku.com/login
[herokuapp]: https://threatdragon-v2.herokuapp.com/#/
[herokucli]: https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli
[herokudash]: https://dashboard.heroku.com/apps
[notarize]: https://developer.apple.com/documentation/security/resolving-common-notarization-issues
[owasp-dock]: https://hub.docker.com/r/owasp/threat-dragon/tags
[releases]: https://github.com/OWASP/www-project-threat-dragon/blob/main/tab_releases.md
[smartsign]: https://support.certum.eu/en/software/procertum-smartsign/
[snapcraft]: https://snapcraft.io/install/threat-dragon/arch
[snapdash]: https://snapcraft.io/threat-dragon/releases
[td-dock]: https://hub.docker.com/r/threatdragon/owasp-threat-dragon/tags
[td-info]: https://github.com/OWASP/www-project-threat-dragon/blob/main/info.md
[td-slack]: https://owasp.slack.com/messages/CURE8PQ68
[ubuntu]: https://login.ubuntu.com/

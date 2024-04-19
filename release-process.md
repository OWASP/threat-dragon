The steps used during the release process

## Tag the release

1. `git clone git@github.com:OWASP/threat-dragon.git`
2. `cd threat-dragon`
3. update version eg `"version": "2.2.0",`, in `package.json`, `td.site/package.json` and `td.server/package.json`
4. update `buildState` in `td.vue/package.json` away from `-demo`, usually ''
5. update package lock files: `npm install`
6. `npm run build`
7. `npm test`
8. `npm run test:vue`
9. `git add --all; git status`
10. `git commit -m"release version 2.2.0"`
11. `git push`
12. tag the release `git tag v2.2.0`
13. `git push origin v2.2.0`

The github release workflow then creates the draft release and the install images

### Publish docker image

1. once tagged, the github workflow pushes the docker image to docker hub
2. check using `docker pull threatdragon/owasp-threat-dragon:v2.2.0`
3. Test using the command to run a detached container:
    `docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:v2.2.0`
4. Ideally test this release on Windows, linux and MacOS using `http://localhost:8080/#/`

If the image tests correctly, promote the docker image
from dockerhub `threatdragon/` to dockerhub `OWASP/threat-dragon/v2.2.0`.

There is _no going back_ on this last step, so it is deliberately left as a manual task:

```text
docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.2.0
docker tag threatdragon/owasp-threat-dragon:v2.2.0 owasp/threat-dragon:v2.2.0
docker push owasp/threat-dragon:v2.2.0
docker pull owasp/threat-dragon:v2.2.0
docker tag owasp/threat-dragon:v2.2.0 owasp/threat-dragon:stable
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
grep sha512 latest-mac.yml | head -n 2 | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' >> checksum-mac.yml
grep sha512 latest.yml | head -n 2 | tail -n 1 | cut -d ":" -f 2 | base64 -d |  \
    hexdump -ve '1/1 "%.2x"' >> checksum.yml
```

- Confirm SHA512 with:

```text
echo "$(cat checksum-linux.yml) Threat-Dragon-ng-2.2.0.AppImage" | sha512sum --check
echo "$(cat checksum-mac.yml) Threat-Dragon-ng-2.2.0.dmg" | sha512sum --check
echo "$(cat checksum.yml) Threat-Dragon-ng-Setup-2.2.0.exe" | sha512sum --check
```

- upload `checksum*.yml` files

### Update release notes

Before adding text to the draft release, click on 'Generate Release Notes' button from the edit window.
If this is done after text is added it does not work.
Edit the 'What's Changed' to filter out any chores.

Then update the release notes for the draft in the [Threat Dragon release area][area]
using the release notes using markdown provided by `.release-note-template.md` as a template,
making sure to revise `2.x.x` to the correct version number such as `2.2.0`

Promote the release from draft to public once everything is in place

### Announce

Update the [releases tab][releases] and the [info pane][td-info] on the OWASP Threat Dragon project pages.

Finally ensure Threat Dragon announces the new release, for example on the OWASP slack channels

[area]: https://github.com/OWASP/threat-dragon/releases
[heroku]: https://id.heroku.com/login
[herokucli]: https://devcenter.heroku.com/articles/heroku-cli#install-the-heroku-cli
[herokudash]: https://dashboard.heroku.com/apps
[releases]: https://github.com/OWASP/www-project-threat-dragon/blob/main/tab_releases.md
[td-info]: https://github.com/OWASP/www-project-threat-dragon/blob/main/info.md

The steps used during the release process

## Tag the release

1. `git clone git@github.com:OWASP/threat-dragon.git`
2. `cd threat-dragon`
3. update version eg `"version": "2.0.10",`, in `package.json`, `td.site/package.json` and `td.server/package.json`
4. update `buildState` in `td.vue/package.json` away from `-demo`, usually ''
5. `npm install`
6. `npm run build`
7. `npm test`
8. `npm run test:vue`
9. `git add --all; git status`
10. `git commit -m"release version 2.0.10"`
11. `git push`
12. tag the release `git tag v2.0.10`
13. `git push origin v2.0.10`

The github release workflow then creates the draft release and the install images

### Publish docker image

1. once tagged, the github workflow pushes the docker image to docker hub
2. check using `docker pull threatdragon/owasp-threat-dragon:v2.0.10`
3. on MacOS M1 this command may need to be used:
    `docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.0.10`
4. Test using the command to run a detached container:
    `docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:v2.0.10`
5. Ideally test this release on Windows, linux and MacOS using `http://localhost:8080/#/`

If the image tests correctly, promote the docker image
from dockerhub `threatdragon/` to dockerhub `OWASP/threat-dragon/v2.0.10`.

There is _no going back_ on this last step, so it is deliberately left as a manual task:

```text
docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.0.10
docker tag threatdragon/owasp-threat-dragon:v2.0.10 owasp/threat-dragon:v2.0.10
docker push owasp/threat-dragon:v2.0.10
docker pull owasp/threat-dragon:v2.0.10
```

ensure the tag now exists within the OWASP Docker hub: `https://hub.docker.com/r/owasp/threat-dragon/tags`

### Update release notes

Update the release notes for the draft in the [Threat Dragon release area][area]
using the release notes using markdown provided by `.release-note-template.md` as a template,
making sure to revise `2.x.x` to the correct version number such as `2.0.10`

Promote the release from draft to public once everything is in place

### Announce

Update the [releases tab][releases] and the [info pane][td-info] on the OWASP Threat Dragon project pages.

Finally ensure Threat Dragon announces the new release, for example on the OWASP slack channels

[area]: https://github.com/OWASP/threat-dragon/releases
[releases]: https://github.com/OWASP/www-project-threat-dragon/blob/main/tab_releases.md
[td-info]: https://github.com/OWASP/www-project-threat-dragon/blob/main/info.md

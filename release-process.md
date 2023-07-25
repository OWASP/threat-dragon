The steps used during the release process

## Tag the release

1. `git clone git@github.com:OWASP/threat-dragon.git`
2. `cd threat-dragon`
3. update version eg `"version": "2.0.2",`, in `package.json`, `td.site/package.json` and `td.server/package.json`
4. update `buildState` in `td.vue/package.json`
5. `npm install`
6. `npm run build`
7. `npm test`
8. `npm run test:vue`
9. add all changes `git add --all`
10. `git commit -a -m"release version 2.0.2"`
11. `git push`
12. tag the release `git tag v2.0.2`
13. `git push origin v2.0.2`

The github release workflow then creates the draft release and the install images

### Publish docker image

1. once tagged, the github workflow pushes the docker image to docker hub
2. check using `docker pull threatdragon/owasp-threat-dragon:v2.0.2`
3. on MacOS M1 this command may need to be used:
    `docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.0.2`
4. Test using the command to run a detached container:
    `docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env threatdragon/owasp-threat-dragon:v2.0.2`
5. Ideally test this release on Windows, linux and MacOS

If the image tests correctly, promote the docker image
from dockerhub `threatdragon/` to dockerhub `OWASP/threat-dragon/v2.0.2`.

There is _no going back_ on this last step, so it is deliberately left as a manual task:

```text
docker pull --platform linux/x86_64 threatdragon/owasp-threat-dragon:v2.0.2
docker tag threatdragon/owasp-threat-dragon:v2.0.2 owasp/threat-dragon:v2.0.2
docker push owasp/threat-dragon:v2.0.2
```

### Update release notes

Update the release notes for the draft in the
[Threat Dragon release area](https://github.com/OWASP/threat-dragon/releases)
and promote the release from draft to public

### Announce

Finally ensure Threat Dragon announces the new release, for example on the OWASP slack channels

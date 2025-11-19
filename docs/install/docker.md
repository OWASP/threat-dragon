---
layout: page
title: Install Docker container
nav_order: 2
path: /install/docker
group: Install
---

## Running the Docker container

The [Threat Dragon](https://owasp.org/www-project-threat-dragon/) web application can be run as a Docker container.

The web application can be run from a Docker container which can either be pulled from [dockerhub][docker] or built locally.

### Pulling/Downloading

The released docker images are provided by the [OWASP dockerhub[docker]
and can be accessed using `docker pull`.
For example to download the latest stable release from the OWASP dockerhub :

`docker pull owasp/threat-dragon:stable`

There are step-by-step instructions for [Bitbucket]({{ '/configure/bitbucket.html' | relative_url }}),
[GitLab]({{ '/configure/gitlab.html' | relative_url }}) and [github]({{ '/configure/github.html' | relative_url }})
access which explain the configuration needed to provide the environment variables for the docker container.

'Stable' is built for OS linux and architectures amd64 (X86) and arm64 (Apple silicon).

The very latest builds are available from the [Threat Dragon dockerhub][td-docker]:

* `docker pull threatdragon/owasp-threat-dragon:latest-arm64` for arm64
* `docker pull threatdragon/owasp-threat-dragon:latest` for amd64 (X86)

Note that these 'latest' builds are not guaranteed to be stable.

### Building

To rebuild the docker image start by cloning the Threat Dragon github project.
Note that this provides the latest source code, rather than a released version:

```text
git init
git clone https://github.com/owasp/threat-dragon.git
cd threat-dragon
```

Threat Dragon is an open source project and there may be a need to change functionality or documentation,
in which case the docker image can be rebuilt and testing applied to the docs or application.

Build the docker image from the top directory of the project, which contains the `Dockerfile`,
using a docker command such as :

`docker build -t owasp-threat-dragon:local .`

Note that a tag 'local' has been used here, but it could be (almost) anything such as 'dev' or 007.

### Environment variables

See the [environment]({{ '/configure/configure.html' | relative_url }}) page
for details on what environment variables are expected.

Threat Dragon supports [dotenv](https://github.com/motdotla/dotenv),
as well as file-based loading by setting environment variables with the `_FILE` postfix,
eg: `ENCRYPTION_KEYS_FILE=/run/secrets/td_encryption_keys`
This is described in the docker-compose section of the environment documentation.

### Running the docker container

Running a locally built image or a downloaded image use the same commands,
substitute the correct name in the command to run a detached container:

`docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:local`

Note that the container will need access to various environment variables, this can be done using the
`-v $(pwd)/.env:/app/.env` part of the command - assuming that the `.env` file
is on the directory from where you run the command.

Windows users may not have access to the PWD environment variable,
and may need to substitute an absolute path instead of `$(pwd)`.

In the example above the container internal port 3000 is mapped to external port 8080,
and so Threat Dragon is accessible within a browser using URL `http://localhost:8080` .
The external port number can be changed to suit the system environment.

The documentation included in the docker image can be accessed from `http://localhost:8080/docs`
again using the example port 8080.

### Debugging

Console output can be displayed using the `-it` options instead of `-d`,
for example `docker run -it -p 8080:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:local`.

If the application is not loading from the expected address and port,
logging can be increased using the `LOG_LEVEL` environment variable.
For example if the `.env` file is edited to include `LOG_LEVEL=debug`
then the container console output for an initial access is :

```text
Using config file: /app/.env
warn: app.js: Rate limiting disabled for development environments {"service":"threat-dragon","timestamp":""}
info: app.js: Express server listening on 3000 {"service":"threat-dragon","timestamp":""}
info: app.js: OWASP Threat Dragon application started {"service":"threat-dragon","timestamp":""}
Express server listening at :: on port 3000
debug: controllers/homecontroller.js: API index request,
sendFile /app/dist/index.html {"service":"threat-dragon","timestamp":""}
```

----

Threat Dragon: _making threat modeling less threatening_

[docker]: https://hub.docker.com/r/owasp/threat-dragon/tags
[td-docker]: https://hub.docker.com/repository/docker/threatdragon/owasp-threat-dragon/tags

---
layout: page
title: Docker Installation
path: /install/docker
nav_order: 3
group: Installation
---

## [OWASP](https://www.owasp.org) Threat Dragon

[Threat Dragon](http://owasp.org/www-project-threat-dragon) comes in two variants, a desktop application and a web application.

## Docker installation instructions
The web application can be run from a docker container.

### Environment variables

See the [environment]({{ 'development/env.html' | relative_url }}) page for details on what environment variables are expected.
Threat Dragon currently supports [dotenv](https://github.com/motdotla/dotenv),
as well as file-based loading by setting environment variables with the `_FILE` postfix, eg: `ENCRYPTION_KEYS_FILE=/run/secrets/td_encryption_keys`
This is also shown in the docker-compose section of the env documentation.

### Running the application

Once your environment variables are set up, you can either build the image yourself or pull from Dockerhub.

#### Building
You can build a local docker image from the top directory of the project, which contains the `Dockerfile`.
Use a command such as:
`docker build -t owasp-threat-dragon:local .`
Note that here we have used a tag `local`, but it could be almost anything such as `dev`.

#### Pulling/Downloading
The released docker images are stored in [Docker Hub](https://hub.docker.com/repository/docker/threatdragon/owasp-threat-dragon)
and can be accessed using docker `pull`. For example to download the `latest` development build from Docker hub use command :
`docker pull threatdragon/owasp-threat-dragon:latest`.
Note that `latest` is the very latest docker image from the main branch on the repository, so it may contain transitory bugs etc.

#### Running
Running a locally built image or a downloaded image are very similar, just substitute the correct name in the command to run a detached container:

`docker run -d -p 8080:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:local`

Note that the container will need access to various environment variables, this can be done using the 
`-v $(pwd)/.env:/app/.env` part of the command - assuming that the `.env` file is on the directory from where you run the command.
Windows users may not have access to the PWD environment variable, so just substitute an absolute path instead of `$(pwd)`.

Here we have mapped the container to port 8080, so Threat Dragon is accessible from http://localhost:8080 .

#### Debugging
Console output can be displayed usig the `-it` options instead of `-d`,
for example `docker run -it -p 8080:3000 -v $(pwd)/.env:/app/.env owasp-threat-dragon:local`.

If the application is not loading from the expected address and port, logging can be increased using the `LOG_LEVEL` environment variable.
For example if the `.env` file is edited to include `LOG_LEVEL=debug` then the container console output for an initial access is :

```
Using config file: /app/.env
warn: app.js: Rate limiting disabled for development environments {"service":"threat-dragon","timestamp":"2022-08-16 11:49:24"}
info: app.js: Express server listening on 3000 {"service":"threat-dragon","timestamp":"2022-08-16 11:49:24"}
info: app.js: OWASP Threat Dragon application started {"service":"threat-dragon","timestamp":"2022-08-16 11:49:24"}
Express server listening at :: on port 3000
debug: controllers/homecontroller.js: API index request, sendFile /app/dist/index.html {"service":"threat-dragon","timestamp":"2022-08-16 11:49:34"}
```

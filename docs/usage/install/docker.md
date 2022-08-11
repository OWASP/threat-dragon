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
`docker build -t owasp-threat-dragon:dev .`

#### Pulling
`docker pull threatdragon/owasp-threat-dragon:v2` (TODO - Tag does not exist yet)

### Running
If running a locally built image, substitute the name in the command below:

`docker run -d -p 3000:3000 threatdragon/owasp-threat-dragon:v2`

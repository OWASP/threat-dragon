---
layout: page
title: Configure local access
nav_order: 1
path: /configure/local
group: Configure
---

## Configure local access

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) can be run as a web application.
The threat models can be stored on the file system local to the client / browser,
and some configuration of environment variables is needed to do this.
These environment variables are described in
the [installation instructions]({{ '/configure/configure.html#environment-variables-reference' | relative_url }}).

## Local file access

This page is a step by step explanation of how to configure the Threat Dragon Web Application for local file system access.
These steps assume that the Threat Dragon web application is being used for learning or testing purposes,
if it is in a production environment then ensure that full security controls
are in place for any publicly accessible or sensitive use.

### Decide on configuration

There are a couple of configuration parameters that need to be determined at the outset.

The Node environment - is it 'test', 'production' or 'development'?
Going with 'development' because using 'production' enforces secure cookies that is not needed here,
and 'test' alters the functionality from what is being tested.

- `NODE_ENV='development'`

Application port number: this defaults to 3000 and can be mapped to another port when running the docker command.
So leave the server port at 3000 by not defining it, and it can then be mapped to external port 8080 using docker.

Server API protocol: this would be set to HTTPS in production, but as we are in development mode define it as HTTP.

- `SERVER_API_PROTOCOL='http'`

Create three new and different keys for encryption, JWT and JWT-refresh using `openssl rand -hex 16` for 128 bit keys.
Do not actually use these keys as shown, but here are examples:

- `ENCRYPTION_JWT_REFRESH_SIGNING_KEY='00112233445566778899aabbccddeeff'`
- `ENCRYPTION_JWT_SIGNING_KEY='deadbeef112233445566778899aabbcc'`
- `ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]'`

### Run from command line

With this minimal set of configuration now available, download the docker image from [DockerHub][dockerhub]:

- `docker pull owasp/threat-dragon:stable`

or if you are running on a MacOS M1 and get "no matching manifest for linux/arm64/v8 in the manifest list entries"
then try:

- `docker pull --platform linux/x86_64  owasp/threat-dragon:stable`

All the information is now ready to try running the server from the command line.
Defining the environment variables on the command line is handy for development and debugging,
but using the dotenv file configuration is easier (which will be discussed later on).

To use the docker command the [Docker daemon][dockerinstall] must be installed and running on the local machine.
During development it is useful to be able to stop the docker container from the command line,
and also have the server logs printed to the console, so the docker parameters `-it --rm` are used.

```text
docker run -it --rm \
-p 8080:3000 \
-e ENCRYPTION_JWT_REFRESH_SIGNING_KEY='00112233445566778899aabbccddeeff' \
-e ENCRYPTION_JWT_SIGNING_KEY='deadbeef112233445566778899aabbcc' \
-e ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]' \
-e NODE_ENV='development' \
-e SERVER_API_PROTOCOL='http' \
owasp/threat-dragon:stable
```

Note that values for the keys need to be replaced with the values obtained in the previous sections.

If the server container starts up correctly then navigate to `http://localhost:8080/#/` to get the main page.
The 'Login to Local Session' button should be present.

If the container does not start then view the logs being dumped to the console,
for example if `ENCRYPTION_JWT_REFRESH_SIGNING_KEY` has not been defined then there will be a log entry:

```text
2023-12-16 08:08:18 ENCRYPTION_JWT_REFRESH_SIGNING_KEY is a required property, Threat Dragon server cannot start without it.
Please see docs/development/environment.md for more information
2023-12-16 08:08:18 OWASP Threat Dragon failed to start
```

Login to Threat Dragon and access files to and from the local filesystem to ensure the web server is running correctly.

### Use environment file

Once the parameters are correct for running the Threat Dragon server,
it is useful to provide a file for (most) of the parameters. Here a test environment file `test.env` has been created:

```text
ENCRYPTION_JWT_REFRESH_SIGNING_KEY='00112233445566778899aabbccddeeff'
ENCRYPTION_JWT_SIGNING_KEY='deadbeef112233445566778899aabbcc'
ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]'
NODE_ENV='development'
SERVER_API_PROTOCOL='http'
```

This has the added benefit of keeping secrets out of the command line history.
The command to run the docker container now becomes:

- `docker run -it --rm -p 8080:3000 -v $(pwd)/test.env:/app/.env owasp/threat-dragon:stable`

or if using Windows:

- `docker run -it --rm -p 8080:3000 -v %CD%/test.env:/app/.env owasp/threat-dragon:stable`

Ensure that Threat Dragon is running on `http://localhost:8080/#/` as expected, and that the filesystem is accessible.

### Logging to Docker desktop

Once the container is successfully configured it is useful to to run the docker container as a background process
and inspect the logs using Docker desktop, rather than have the server logs printed to the console.
This is achieved using docker parameter `-d` :

- `docker run -d -p 8080:3000 -v $(pwd)/test.env:/app/.env owasp/threat-dragon:stable`

or if using Windows:

- `docker run -d -p 8080:3000 -v %CD%/test.env:/app/.env owasp/threat-dragon:stable`

----

Threat Dragon: _making threat modeling less threatening_

[dockerhub]: https://hub.docker.com/r/owasp/threat-dragon
[dockerinstall]: https://docs.docker.com/engine/install/

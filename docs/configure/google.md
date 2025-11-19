---
layout: page
title: Configure Google Drive access
nav_order: 5
path: /configure/google
group: Configure
---

## Configure Google Drive access

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) can be run as a web application and
if Google Drive access is required then some configuration is needed
for the necessary environment variables.
The Google Drive specific environment variables are listed at the [end of this page](#google-drive-environment-variables),
other variables are described in
the [installation instructions]({{ '/configure/configure.html#environment-variables-reference' | relative_url }}).

## Google Drive access

This page is a step by step explanation of how to configure the Threat Dragon web application for access to a Google Drive.
Most of these steps assume that the web application is being used for learning or testing purposes,
if it is in a production environment then ensure that full security controls
are in place for any public accessible or sensitive use.

### Decide on configuration

There are various configuration parameters that need to be determined at the outset.

The Node environment - is it 'test', 'production' or 'development'?
Here 'development' is being used because 'production' enforces secure cookies that are not needed here,
and 'test' alters the functionality in some subtle ways.

- `NODE_ENV='development'`

Server port number - this defaults to 3000, and it can be mapped to another port when running the docker command.
So leave the server port at 3000 by not defining it, and it can then be mapped to external port 8080 using docker.

Server API protocol - this would be set to HTTPS in production, but during development define it as HTTP:

- `SERVER_API_PROTOCOL='http'`

Create three new and different keys for encryption, JWT and JWT-refresh using `openssl rand -hex 16` for 128 bit keys.
Do not actually use these keys as shown, but here are examples:

- `ENCRYPTION_JWT_REFRESH_SIGNING_KEY='00112233445566778899aabbccddeeff'`
- `ENCRYPTION_JWT_SIGNING_KEY='deadbeef112233445566778899aabbcc'`
- `ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]'`

### Access to Google Drive

There are three environment variables required for accessing a Google Drive:
the `GOOGLE_CLIENT_ID`, the `GOOGLE_CLIENT_SECRET` and the `GOOGLE_REDIRECT_URI`.

Another Google Drive environment variable, `GOOGLE_SCOPE` can usually be left
with its default value of `openid email profile`, but here we will set it explicitly:

- `GOOGLE_SCOPE=openid email profile`

The URI used when redirecting from authorization can be set to a
localhost, but in practice this may well be a different URL/URI:

- `GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/return`

Threat Dragon will be configured to use OAuth 2.0 to access Google APIs,
and so must have authorization credentials that identify it to Google's OAuth 2.0 server.

To create these credentials open the [Google Drive Clients][gclients] dashboard:

- select or create a Google Drive project
- click on the 'Create OAuth Client' button
- application type should be set to 'Web Application'
- provide a name for the Google Drive client, anything that is indicative / memorable
- after the 'Create' button, the dashboard will provide the client ID and secret

The client ID and secret can then used for the configuration :

- `GOOGLE_CLIENT_ID=01234567890123456789`
- `GOOGLE_CLIENT_SECRET=0123456789abcdef0123456789abcdef0123456`

Clearly the secrets shown here are _could not be used_ for a real application,
they are merely for illustrative purposes.

### Run from command line

With a set of configuration settings now available, download the docker image from [DockerHub][dockerhub]:

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
-e GOOGLE_CLIENT_ID='01234567890123456789' \
-e GOOGLE_CLIENT_SECRET='0123456789abcdef0123456789abcdef0123456' \
-e GOOGLE_SCOPE='openid email profile' \
-e GOOGLE_REDIRECT_URI='http://localhost:3000/api/oauth/return' \
-e ENCRYPTION_JWT_REFRESH_SIGNING_KEY='00112233445566778899aabbccddeeff' \
-e ENCRYPTION_JWT_SIGNING_KEY='deadbeef112233445566778899aabbcc' \
-e ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]' \
-e NODE_ENV='development' \
-e SERVER_API_PROTOCOL='http' \
owasp/threat-dragon:stable
```

Note that values for the keys need to be replaced with the values obtained in the previous sections,
and also note the use of quotation marks.

![Google Drive button]({{ '/assets/images/google-drive-button.png' | relative_url }}){: .float-right }

If the server container starts up correctly then navigate to `http://localhost:8080/#/` to get the main page.
With a `GOOGLE_CLIENT_ID` set then the 'Login with Google' button is made visible.

If the container does not start then view the logs being dumped to the console,
for example if `ENCRYPTION_JWT_REFRESH_SIGNING_KEY` has not been defined then there will be a log entry:

```text
2023-12-16 08:08:18 ENCRYPTION_JWT_REFRESH_SIGNING_KEY is a required property, Threat Dragon server cannot start without it.
Please see docs/development/environment.md for more information
2023-12-16 08:08:18 OWASP Threat Dragon failed to start
```

### Login to Google Drive

From the main Threat Dragon page click on the 'Login with Google' button.
If access is permitted then the main Threat Dragon page is displayed
and threat models can be read from and written to the user's Google Drive.

The Threat Dragon web server is now running correctly.

### Use environment file

Once the parameters are correct for running the Threat Dragon server,
it is useful to provide a file for (most) of the parameters. Here a test environment file `test.env` has been created:

```text
GOOGLE_CLIENT_ID=01234567890123456789
GOOGLE_CLIENT_SECRET=0123456789abcdef0123456789abcdef0123456
GOOGLE_SCOPE=openid email profile
GOOGLE_REDIRECT_URI=http://localhost:3000/api/oauth/return
ENCRYPTION_JWT_REFRESH_SIGNING_KEY=00112233445566778899aabbccddeeff
ENCRYPTION_JWT_SIGNING_KEY=deadbeef112233445566778899aabbcc
ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]'
NODE_ENV=development
SERVER_API_PROTOCOL=http
```

Note that quotation marks are only needed for the `ENCRYPTION_KEYS` object.

The use of an environment file has the added benefit of keeping secrets out of the command line history.
The command to run the docker container now becomes:

- `docker run -it --rm -p 8080:3000 -v $(pwd)/test.env:/app/.env owasp/threat-dragon:stable`

or if using Windows:

- `docker run -it --rm -p 8080:3000 -v %CD%/test.env:/app/.env owasp/threat-dragon:stable`

Ensure that Threat Dragon is running on `http://localhost:8080/#/` as expected, and that the Google Drive is accessible.

### Google Drive environment variables

| Google Drive specifics | Description | Default |
| --- | --- | --- |
| `GOOGLE_CLIENT_ID` | Required authorization client API ID | |
| `GOOGLE_CLIENT_SECRET` | Required authorization client API secret | |
| `GOOGLE_SCOPE` | Optional authorization scopes | `openid email profile` |
| `GOOGLE_REDIRECT_URI` | Required URL following successful authorization | |

----

Threat Dragon: _making threat modeling less threatening_

[dockerhub]: https://hub.docker.com/r/owasp/threat-dragon
[dockerinstall]: https://docs.docker.com/engine/install/
[gclients]: https://console.developers.google.com/auth/clients

---
layout: page
title: Configure Bitbucket access
nav_order: 3
path: /configure/bitbucket
group: Configure
---

## Configure Bitbucket access

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) can be run as a web application and
if Bitbucket repository access is required then some configuration is needed
of the necessary environment variables.
The Bitbucket specific environment variables are listed at the [end of this page](#bitbucket-environment-variables),
other variables are described in
the [installation instructions]({{ '/configure/configure.html#environment-variables-reference' | relative_url }}).

## Bitbucket repository access

This page is a step by step explanation of how to configure the Threat Dragon Web App for access to Atlassian Bitbucket.
Most of these steps assume that the Threat Dragon web application is being used for learning
or testing purposes, if it is in a production environment then ensure that full security controls are in place
for any public accessible or sensitive use.

Note that Bitbucket access is for a specific workspace, in contrast to the much wider GitHub access.

### Decide on configuration

There are various configuration parameters that need to be determined at the outset.

The Node environment - is it 'test', 'production' or 'development'?
Going with 'development' because using 'production' enforces secure cookies that is not needed here,
and 'test' alters the functionality from what is being tested.

- `NODE_ENV='development'`

Server port number - this defaults to 3000, and it can be mapped to another port when running the docker command.
So leave the server port at 3000 by not defining it, and it can then be mapped to external port 8080 using docker.

Server API protocol - this would be set to HTTPS in production, but during development define it as HTTP.

- `SERVER_API_PROTOCOL='http'`

Decide which Bitbucket repository workspace is to be accessed, and what scope to apply.
For the purposes of this testing a bitbucket repo has been created at `https://bitbucket.org/threat-dragon-test/`,
which gives the workspace name as 'threat-dragon-test'.
Set the workspace name to 'threat-dragon-test' and the scope to 'repository:write' using:

- `BITBUCKET_SCOPE='repository:write'`
- `BITBUCKET_WORKSPACE='threat-dragon-test'`

Create three new and different keys for encryption, JWT and JWT-refresh using `openssl rand -hex 16` for 128 bit keys.
Do not actually use these keys as shown, but here are examples:

- `ENCRYPTION_JWT_REFRESH_SIGNING_KEY='00112233445566778899aabbccddeeff'`
- `ENCRYPTION_JWT_SIGNING_KEY='deadbeef112233445566778899aabbcc'`
- `ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]'`

### Bitbucket Access

The Threat Dragon web application uses an [Atlassian OAuth consumer][bitbucketoauth] as the mechanism to access
the Bitbucket API for the given repository workspace.
An OAuth consumer needs to be created for use by the web app to access Bitbucket,
and this consumer provides the values `BITBUCKET_CLIENT_ID` and `BITBUCKET_CLIENT_SECRET`.

To create the OAuth consumer you need to know the port number and domain of the Threat Dragon application.
Here port number 8080 is being used (a decision made in the previous section) and as it is being run locally
then the domain will probably be 'localhost'.

Log into your Bitbucket account and within the  workspace navigate to
'Settings' (the cog) -> 'Workspace Settings' -> 'Apps and Features' -> 'OAuth consumers' -> 'Add consumer'

Fill out the form with the following suggested content:

- Name: a unique identifier for the application. This is not critical, something like 'Threat Dragon testing' will do
- Description: for example 'Threat Dragon testing for local development'
- Callback URL: for localhost and port 8080 use `http://localhost:8080/api/oauth/return`
- Permissions: as a minimum Read-Only for the Account and Read/Write for Repositories, Projects and Workplace Membership
- Proceed by saving the OAuth consumer

Note the displayed values for both the Key and the Secret and __save these somewhere secure__ .
Treat these values with the same security as a password; they provide access to your Bitbucket account.

- Key will be 20 hexadecimal (10 byte) characters, for example `deadbeef0123456789ab` used for `BITBUCKET_CLIENT_ID`
- Secret will be 32 hexadecimal characters, for example `deadbeef0123456789abcdefdeadbeef` used for `BITBUCKET_CLIENT_SECRET`

The Bitbucket OAuth consumer is now ready for use by the Threat Dragon server with values:

- `BITBUCKET_CLIENT_ID='deadbeef0123456789ab'`
- `BITBUCKET_CLIENT_SECRET='deadbeef0123456789abcdefdeadbeef'`

Clearly the secrets shown here are _not to be used_ for a real application,
they are merely for illustrative purposes.

Example of registering a new OAuth consumer:

![New Bitbucket OAuth consumer]({{ '/assets/images/bitbucket-oauth-consumer.png' | relative_url }})

And providing a set of minimal permissions for the OAuth consumer:

![Bitbucket OAuth permissions]({{ '/assets/images/bitbucket-oauth-permissions.png' | relative_url }})

#### Run from command line

With a minimal set of configuration now available, download the docker image from [DockerHub][dockerhub]:

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
-e BITBUCKET_CLIENT_ID='deadbeef0123456789ab' \
-e BITBUCKET_CLIENT_SECRET='deadbeef0123456789abcdefdeadbeef' \
-e BITBUCKET_SCOPE='repository:write' \
-e BITBUCKET_WORKSPACE='threat-dragon-test' \
-e ENCRYPTION_JWT_REFRESH_SIGNING_KEY='00112233445566778899aabbccddeeff' \
-e ENCRYPTION_JWT_SIGNING_KEY='deadbeef112233445566778899aabbcc' \
-e ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]' \
-e NODE_ENV='development' \
-e SERVER_API_PROTOCOL='http' \
owasp/threat-dragon:stable
```

Note that values for the keys need to be replaced with the values obtained in the previous sections,
and also note the use of quotation marks.

![Bitbucket button]({{ '/assets/images/bitbucket-button.png' | relative_url }}){: .float-right }

If the server container starts up correctly then navigate to `http://localhost:8080/#/` to get the main page.
With a `BITBUCKET_CLIENT_ID` set then the 'Login with Bitbucket' button is made visible.

If the container does not start then view the logs being dumped to the console,
for example if `ENCRYPTION_JWT_REFRESH_SIGNING_KEY` has not been defined then there will be a log entry:

```text
2023-12-16 08:08:18 ENCRYPTION_JWT_REFRESH_SIGNING_KEY is a required property, Threat Dragon server cannot start without it.
Please see docs/development/environment.md for more information
2023-12-16 08:08:18 OWASP Threat Dragon failed to start
```

### Login to Bitbucket

From the main Threat Dragon page click on the 'Login with Bitbucket' button.
If you are not logged in already then Bitbucket will prompt for the user account credentials
before allowing access to the workspace.

Once you are logged in then Bitbucket will ask if the Threat Dragon OAuth consumer is allowed to access the repo:

![Authorize Bitbucket OAuth consumer]({{ '/assets/images/bitbucket-authorize.png' | relative_url }})

If access is permitted then the main Threat Dragon page is displayed and threat models can be
read from and written to the user's public repositories.

The Threat Dragon web server is now running correctly.

### Use environment file

Once the parameters are correct for running the Threat Dragon server,
it is useful to provide a file for (most) of the parameters. Here a test environment file `test.env` has been created:

```text
BITBUCKET_CLIENT_ID=deadbeef0123456789ab
BITBUCKET_CLIENT_SECRET=deadbeef0123456789abcdefdeadbeef
BITBUCKET_SCOPE=repository:write
BITBUCKET_WORKSPACE=threat-dragon-test
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

Ensure that Threat Dragon is running on `http://localhost:8080/#/` as expected,
and that the Bitbucket workspace is accessible.

### Logging to Docker desktop

Once the container is successfully configured it is useful to to run the docker container as a background process
and inspect the logs using Docker desktop, rather than have the server logs printed to the console.
This is achieved using docker parameter `-d` :

- `docker run -d -p 8080:3000 -v $(pwd)/test.env:/app/.env owasp/threat-dragon:stable`

or if using Windows:

- `docker run -d -p 8080:3000 -v %CD%/test.env:/app/.env owasp/threat-dragon:stable`

### Bitbucket environment variables

| Bitbucket specifics | Description | Default |
| --- | --- | --- |
| `BITBUCKET_CLIENT_ID` | Provided by the Bitbucket OAuth app used for authentication | |
| `BITBUCKET_CLIENT_SECRET` | Secret generated by the Bitbucket OAuth authentication app | |
| `BITBUCKET_WORKSPACE` | The workspace name provided by the Bitbucket repo |  |
| `BITBUCKET_SCOPE` | Optional definition of scope, set to `repository:write` for write permissions to the repo | `repository:read` |
| `BITBUCKET_ENTERPRISE_HOSTNAME` | Optional fully qualified Bitbucket enterprise instance hostname, e.g. bitbucket.example.com | |
| `BITBUCKET_ENTERPRISE_PORT` | Optional if your Bitbucket enterprise instance uses a nonstandard port | `443` |
| `BITBUCKET_ENTERPRISE_PROTOCOL` | Optional if your Bitbucket enterprise instance uses a nonstandard protocol | `https` |
| `BITBUCKET_REPO_ROOT_DIRECTORY` | Optional path where saved models are stored in a Bitbucket repo | |

----

Threat Dragon: _making threat modeling less threatening_

[dockerhub]: https://hub.docker.com/r/owasp/threat-dragon
[dockerinstall]: https://docs.docker.com/engine/install/
[bitbucketoauth]: https://developer.atlassian.com/server/jira/platform/oauth/

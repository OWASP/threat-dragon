---
layout: page
title: Configure Github access
nav_order: 2
path: /configure/github
group: Configure
---

## Configure Github access

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) can be run as a web application and
if Github repository access is required then some configuration is needed
for the necessary environment variables.
The Github specific environment variables are listed at the [end of this page](#github-environment-variables),
other variables are described in
the [installation instructions]({{ '/configure/configure.html#environment-variables-reference' | relative_url }}).

## Github repository access

This page is a step by step explanation of how to configure the Threat Dragon web application for github access.
Most of these steps assume that the web application is being used for learning
or testing purposes,
if it is in a production environment then ensure that full security controls
are in place for any public accessible or sensitive use.

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

Create three new and different keys for encryption, JWT and JWT-refresh using `openssl rand -hex 16` for 128 bit keys.
Do not actually use these keys as shown, but here are examples:

- `ENCRYPTION_JWT_REFRESH_SIGNING_KEY='00112233445566778899aabbccddeeff'`
- `ENCRYPTION_JWT_SIGNING_KEY='deadbeef112233445566778899aabbcc'`
- `ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]'`

### GitHub Access

The Threat Dragon web application uses [GitHub OAuth Applications][githuboauth] as the mechanism to access
the GitHub API of the users repositories.
A GitHub OAuth Application needs to be created for use by the web app to access github,
and the GitHub OAuth Application provides the values `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

To create a GitHub OAuth Application you need to know the port number and domain of the Threat Dragon application.
Here port number 8080 is being used (a decision made in the previous section) and as it is being run locally
then the domain will probably be 'localhost'.

1. Log into your GitHub account and navigate to 'Settings' -> 'Developer settings' -> 'OAuth Apps' -> 'New OAuth App'
2. Fill out the form with the following suggested content:
    1. Application name: a unique identifier for the application.
        This is not critical, something like 'Threat Dragon tests' will do
    2. Homepage URL: local development so use `http://localhost:8080/#`
    3. Application description: for example 'Threat Dragon testing for local development'
    4. Authorization callback URL: for localhost and port 8080 use `http://localhost:8080/api/oauth/return`
3. Proceed by agreeing to Register the application
4. Initially there will be no Client secret; create a client secret via the 'Generate a new client secret' button
5. Note the values for both the Client ID and the Client Secret, __save these somewhere secure__
    1. Client ID will be 20 hexadecimal (10 byte) characters, for example `deadbeef0123456789aa`
    2. Client Secret will be 40 hexadecimal characters, for example `deadbeef0123456789abcdef01234567deadbeef`
    3. Treat these values with the same security as a password; they provide access to your GitHub account

The GitHub OAuth Application is now ready for use by the Threat Dragon server with example values:

- `GITHUB_CLIENT_ID='deadbeef0123456789ab'`
- `GITHUB_CLIENT_SECRET='deadbeef0123456789abcdef01234567deadbeef'`

Clearly the secrets shown here are _not to be used_ for a real application,
they are merely for illustrative purposes.

Example of registering a new OAuth application:

![New GitHub OAuth Application]({{ '/assets/images/github-oauth-app.png' | relative_url }})

### Run from command line

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
-e GITHUB_CLIENT_ID='deadbeef0123456789ab' \
-e GITHUB_CLIENT_SECRET='deadbeef0123456789abcdef01234567deadbeef' \
-e ENCRYPTION_JWT_REFRESH_SIGNING_KEY='00112233445566778899aabbccddeeff' \
-e ENCRYPTION_JWT_SIGNING_KEY='deadbeef112233445566778899aabbcc' \
-e ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]' \
-e NODE_ENV='development' \
-e SERVER_API_PROTOCOL='http' \
owasp/threat-dragon:stable
```

Note that values for the keys need to be replaced with the values obtained in the previous sections,
and also note the use of quotation marks.

![Github button]({{ '/assets/images/login.png' | relative_url }}){: .float-right }

If the server container starts up correctly then navigate to `http://localhost:8080/#/` to get the main page.
With a `GITHUB_CLIENT_ID` set then the 'Login with GitHub' button is made visible.

If the container does not start then view the logs being dumped to the console,
for example if `ENCRYPTION_JWT_REFRESH_SIGNING_KEY` has not been defined then there will be a log entry:

```text
2023-12-16 08:08:18 ENCRYPTION_JWT_REFRESH_SIGNING_KEY is a required property, Threat Dragon server cannot start without it.
Please see docs/development/environment.md for more information
2023-12-16 08:08:18 OWASP Threat Dragon failed to start
```

### Login to Github

From the main Threat Dragon page click on the 'Login with GitHub' button.
If you are not logged in already then GitHub will prompt for the user account credentials before allowing access to the repo:

![Sign in to GitHub]({{ '/assets/images/github-sign-in.png' | relative_url }})

Once you are logged in then github will ask if the Threat Dragon GitHub OAuth Application is allowed to access the repo:

![Authorize GitHub OAuth Application]({{ '/assets/images/github-authorize.png' | relative_url }})

If access is permitted then the main Threat Dragon page is displayed and threat models can be
read from and written to the user's public repositories.

The Threat Dragon web server is now running correctly.

### Use environment file

Once the parameters are correct for running the Threat Dragon server,
it is useful to provide a file for (most) of the parameters. Here a test environment file `test.env` has been created:

```text
GITHUB_CLIENT_ID=deadbeef0123456789ab
GITHUB_CLIENT_SECRET=deadbeef0123456789abcdef01234567deadbeef
ENCRYPTION_JWT_REFRESH_SIGNING_KEY=00112233445566778899aabbccddeeff
ENCRYPTION_JWT_SIGNING_KEY=deadbeef112233445566778899aabbcc'
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

Ensure that Threat Dragon is running on `http://localhost:8080/#/` as expected, and that the GitHub repos are accessible.

### Logging to Docker desktop

Once the container is successfully configured it is useful to to run the docker container as a background process
and inspect the logs using Docker desktop, rather than have the server logs printed to the console.
This is achieved using docker parameter `-d` :

- `docker run -d -p 8080:3000 -v $(pwd)/test.env:/app/.env owasp/threat-dragon:stable`

or if using Windows:

- `docker run -d -p 8080:3000 -v %CD%/test.env:/app/.env owasp/threat-dragon:stable`

### Github environment variables

| Github specifics | Description | Default |
| --- | --- | --- |
| `GITHUB_CLIENT_ID` | Provided by the GitHub OAuth app used for authentication | |
| `GITHUB_CLIENT_SECRET` | Secret generated by the GitHub OAuth authentication app | |
| `GITHUB_SCOPE` | Optional definition of scope: `repo` to access both private and public repos or `public_repo` to access public repos only | `public_repo` |
| `GITHUB_ENTERPRISE_HOSTNAME` | Optional fully qualified github enterprise instance hostname, e.g. github.example.com | |
| `GITHUB_ENTERPRISE_PORT` | Optional if your github enterprise instance uses a nonstandard port | `443` |
| `GITHUB_ENTERPRISE_PROTOCOL` | Optional if your github enterprise instance uses a nonstandard protocol | `https` |
| `GITHUB_USE_SEARCH` | Optional, if true it will only display the github repos matching the search query below| `false`|
| `GITHUB_SEARCH_QUERY` | Optionally specifies the search query to use when searching for Threat Dragon github repos | |
| `GITHUB_REPO_ROOT_DIRECTORY` | Optional path where saved models are stored in a Github repo | |

----

Threat Dragon: _making threat modeling less threatening_

[dockerhub]: https://hub.docker.com/r/owasp/threat-dragon
[dockerinstall]: https://docs.docker.com/engine/install/
[githuboauth]: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app

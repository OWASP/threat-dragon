---
layout: page
title: Configure environment
nav_order: 0
path: /configure
group: Configure
---

## Configure environment

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) comes in two variants,
a desktop application and a web application.
If the web application variant is being used then some configuration is needed
to provide the necessary environment variables.

## Quick-start

These are the quick steps to running a demo of the Threat Dragon web application:

1. Download the [Threat Dragon source][releases] and expand the archive
2. From the top directory, copy `minimal.env` to `.env`
3. [Generate Keys](#generating-keys) for encryption and JWT signing
4. Update the encryption values in `.env`
5. From the top directory run `npm install` and then `npm start`
6. Threat Dragon can then be accessed from a browser URL `http://localhost:8080`

This will provide a __demo__ web application configured to store models
only in the file system local to the client/browser.

![Quick start demo]({{ '/assets/images/quick-demo.png' | relative_url }})

## Environment configuration

In practice Threat Dragon should be properly secured and configured, see the instructions to
[configure local access]({{ '/configure/local.html' | relative_url }}) for an example.

The web application can be configured for various repository / drive access:

- Google Drive
- GitHub and Github Enterprise
- Bitbucket and Bitbucket Enterprise
- GitLab

Refer to the appropriate [step by step guide](#remote-environments).

### Generating Keys

A random 16 byte (32 character, 256 bit) hexadecimal string should be used for encryption,
which needs to be randomly generated and kept secret.
With openssl installed use this command to generate a new 256 bit key: `openssl rand -hex 16`

This command can also be used to generate JWT signing keys.

The Express server documentation on [express-session](https://github.com/expressjs/session#readme)
has advice on managing and rotating encryption keys.

### Environment errors

The application will throw an error if a required environment variable is missing during application start. For example:

```text
ENCRYPTION_KEYS is a required property.  Threat Dragon server cannot start without it.
Refer to development/environment.md for more information
```

## Configuration using DotEnv

Environment variables are configured via [dotenv](https://github.com/motdotla/dotenv#readme).
By default, Threat Dragon attempts to read key/value pairs from a `.env` file at the root of this repository.
This can be configured by exporting a file path in your terminal.
For example, on MacOS/Linux: `export ENV_FILE=/home/myawesomeuser/mydir/somefile.env`

To get started, copy `example.env` to `.env` at the root of the project and update the variables as appropriate.

Note: Do not use the `export` or `set` keywords inside your `.env` file,
as this will not work from within a docker context.
The `dotenv` package will automatically export the variables for you.

Alternatively the environment variables can be set using the [command line](#configuration-using-command-line).

Here is an example of a minimal DotEnv file, note that real keys would need to be generated :

```text
ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "11223344556677889900aabbccddeeff"}]'
ENCRYPTION_JWT_SIGNING_KEY=asdfasdfasdf
ENCRYPTION_JWT_REFRESH_SIGNING_KEY=fljasdlfkjadf
NODE_ENV=development
SERVER_API_PROTOCOL=http
```

Note that the environment variable `SERVER_API_PROTOCOL` defaults to 'https',
and in a production environment the server will need valid certificates to run HTTPS.

## Configuration using command Line

The environment variables can be set from the command line.
Export the variables from the terminal where you will start Threat dragon.  

For example to set the `GITHUB_CLIENT_ID` on MacOS / Linux use: `export GITHUB_CLIENT_ID=deadbeef0123456789ab`

Or on Windows systems: `set GITHUB_CLIENT_ID=deadbeef0123456789ab`

## Configuration using file-based secrets

If using file based secrets, add `_FILE` to the end of the secret name, and the value should point to the file location.
This is particularly useful if you are running Threat Dragon in docker context,
as you can use docker secrets or orchestrator such as kubernetes.

An example using docker secrets:

- Create your secrets, for example: `echo "01234567890123456789" | docker secret create github_client_id -`
- Create a docker compose file (example below)
- Deploy to your docker swarm, for example: `docker stack deploy --compose-file docker-compose.yaml owasp-threatdragon`

Example compose file:

```text
version: '3.1'
services:
  threatdragon:
    # Always use a specific version tag, as "latest" may be a development build
    # Alternatively, you can use the "stable" tag, as that will always
    # be the most recently released version
    image: owasp/threat-dragon:v2.0.0
    ports:
      - 3000:3000
    environment:
      GITHUB_CLIENT_ID_FILE: /run/secrets/github_client_id
      GITHUB_CLIENT_SECRET_FILE: /run/secrets/github_client_secret
      ENV_FILE: /run/secrets/node_env
      ENCRYPTION_KEYS_FILE: /run/secrets/encryption_keys
      ENCRYPTION_JWT_SIGNING_KEY_FILE: /run/secrets/jwt_signing_key
      ENCRYPTION_JWT_REFRESH_SIGNING_KEY_FILE: /run/secrets/jwt_refresh_signing_key
      SERVER_API_PROTOCOL_FILE: /run/secrets/protocol
    secrets:
      - github_client_id
      - github_client_secret
      - node_env
      - encryption_keys
      - jwt_signing_key
      - jwt_refresh_signing_key
      - protocol

secrets:
  github_client_id:
    external: true
  github_client_secret:
    external: true
  node_env:
    external: true
  encryption_keys:
    external: true
  jwt_signing_key:
    external: true
  jwt_refresh_signing_key:
    external: true
  protocol:
    external: true
```

## Environment variables reference

Not all environment variables need to be defined,
it depends on what repository access is required and whether running the desktop or not.

### Front-end specific environment

| Variable | Description | Default |
| --- | --- | --- |
| `APP_HOSTNAME` | Optional FQDN hostname, required if using TLS | |
| `APP_USE_TLS` | Enables use of TLS if set true | false |
| `APP_PORT` | Optional connection port | 8080 |
| `APP_TLS_CERT_PATH` | Locates the TLS certificate if TLS used | |
| `APP_TLS_KEY_PATH` | Locates the TLS key if TLS used | |
| `ENV_FILE` | The location of a dotenv file, if dotenv is used. Exported as it needs to be accessed before the dotenv file is read | `.env` |
| `NODE_ENV` | Optional run mode such as 'test', 'production' or 'development' | `production` |

The secure cookie flag is set only if running in 'production' mode.

### Desktop specific environment

| Desktop/Electron specifics | Description | Default |
| --- | --- | --- |
| `IS_TEST` | Enabled during automated testing | false |
| `WEBPACK_DEV_SERVER_URL` | Electron load URL when in development mode | |

The desktop environment variable `WEBPACK_DEV_SERVER_URL` is used by electron
if either `NODE_ENV` 'development' or 'test' modes are defined,
for example `http://localhost:3000/`, but not in 'production' mode.

### Server side specific environment

| Back-end specifics | Description | Default |
| --- | --- | --- |
| `ENCRYPTION_KEYS` | Required encryption keys used to encrypt any high risk data | |
| `ENCRYPTION_JWT_SIGNING_KEY` | Required key used to sign JWTs | |
| `ENCRYPTION_JWT_REFRESH_SIGNING_KEY` | Required key used to sign refresh tokens | |
| `LOG_LEVEL` | The server logging level: `audit` / `error` / `warn` / `info` / `debug` / `silly` | `warn` |
| `LOG_MAX_FILE_SIZE` | Maximum size of the back-end express server log file, in MB | `24` |
| `PORT` | Server-side listening port | `3000`|
| `REPO_USE_SEARCH` | Enables filtering for repository accesses | false |
| `REPO_SEARCH_QUERY` | Provides search string if repo search enabled | |
| `REPO_ROOT_DIRECTORY` | Optional path where saved models are stored in the repo | |
| `SERVER_API_PROTOCOL` | Protocol between server and front-end: `http` / `https` | `https` |

__Note__ : the JWT refresh signing key should be different from the JWT signing key as they are different tokens.
A JWT is used as the refresh token because it is tamper resistant and provides user context.

### Remote environments

Refer to the step by step guide pages for setting the environment variables specific for these technologies:

- [Google Drive]({{ '/configure/google.html' | relative_url }}) and
    [specific variables]({{ '/configure/google.html#google-drive-environment-variables' | relative_url }})
- [GitHub repository]({{ '/configure/github.html' | relative_url }}) and
    [specific variables]({{ '/configure/github.html#github-environment-variables' | relative_url }})
- [Bitbucket repository]({{ '/configure/bitbucket.html' | relative_url }})and
    [specific variables]({{ '/configure/bitbucket.html#bitbucket-environment-variables' | relative_url }})
- [GitLab repository]({{ '/configure/gitlab.html' | relative_url }}) and
    [specific variables]({{ '/configure/gitlab.html#gitlab-environment-variables' | relative_url }})

----

Threat Dragon: _making threat modeling less threatening_

[releases]: https://github.com/OWASP/threat-dragon/releases/

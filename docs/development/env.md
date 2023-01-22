---
layout: page
title: Environment
nav_order: 0
path: /env
group: Environment
---

# [OWASP](https://www.owasp.org) Threat Dragon

## Table of Contents
1. [Quickstart](#quickstart)
1. [Create A GitHub OAuth Application](#create-a-github-oauth-application)
1. [Generate Keys](#generating-keys)
1. [Config Via DotEnv](#config-via-dotenv)
1. [Environment Errors](#environment-errors)
1. [Command Line](#command-line)
1. [All Variables (and what they do)](#all-variables)
1. [Example Github OAuth Screenshot](#github-oauth-app-screenshot)

___

## Quickstart
1. [Create A GitHub OAuth Application](#create-a-github-oauth-application)
1. [Generate Keys](#generating-keys) for encryption and JWT signing
1. Copy `example.env` to `.env`
1. Update the values in `.env`
1. `pnpm install`
1. `pnpm run serve`

___

## Create A GitHub OAuth Application
This web application uses GitHub OAuth applications as the authentication mechanism.
There is [work](https://github.com/OWASP/threat-dragon/issues/1) [planned](https://github.com/OWASP/threat-dragon/issues/9)
to add [additional](https://github.com/OWASP/threat-dragon/issues/61) authentication providers in the future.

There is an [open issue](https://github.com/OWASP/threat-dragon/issues/14) with regards to GitHub and OAuth permissions.

To create a GitHub OAuth Application:
1. Log into your GitHub account, go to `Settings -> 'Developer settings' -> 'OAuth Apps' -> 'New OAuth App'`
2. Fill out the form with the following:
- **Application name**: A unique identifier for the application.  This is not critical, we suggest something like 'Threat Dragon'
- **Homepage URL**: For local development, use `http://localhost:8080`
  - If you configure Threat Dragon to listen on another port, use that port here instead of 8080
- **Application description**: A description for your OAuth app.  This is not critical, we suggest something like 'Threat Dragon for local development'
- **Authorization callback URL**: `http://localhost:3000/api/oauth/return`
  - If you configure Threat Dragon's server away from the default port 3000, be sure to use that port for the auth callback url
3. Register the application, an [example screenshot](#github-oauth-app-screenshot) is at the bottom of this document
4. Create a client_secret
5. Note the values for Client ID and Client Secret. **Save these somewhere safe**
- Client ID will look similar to `01234567890123456789`
- Client Secret will look similar to `0123456789abcdef0123456789abcdef01234567`
- Treat these values like you would a password.  If these values get out, someone could gain full access to your GitHub account

___

## Generating Keys
A random 32 bit hexidecimal string should be used for encryption.

You want this to be randomly generated, and keep it a secret.

If you have openssl installed, you can use this command to generate a new secret: `openssl rand -hex 16`
[express-session](https://github.com/expressjs/session#readme) has some good advice on managing and rotating encryption keys.

A similar method could be used to generate JWT signing keys.

___

## Config Via DotEnv
Environment variables are configured via [dotenv](https://github.com/motdotla/dotenv#readme).
By default, Threat Dragon attempts to read key/value pairs from a `.env` file at the root of this repository.
This can be configured by exporting a file path in your terminal.
For example, on MacOS/Linux: `export ENV_FILE=/home/myawesomeuser/mydir/somefile.env`

To get started, copy `example.env` to `.env` at the root of the project and update the variables as appropriate. 

**Note**: Do not use the `export` or `set` keywords inside your `.env` file, as this will not work from within a docker context.
The `dotenv` package will automatically export the variables for you.

Alternatively, you can also set your environment variables via [command line](#command-line) if you'd prefer.

___

## Environment Errors

The application will throw an error if a required environment variable is missing during application start:

`GITHUB_CLIENT_ID is a required property.  Threat Dragon server cannot start without it.  Please see setup-env.md for more information`

___

## File Based Secrets
If using file based secrets, add `_FILE` to the end of the secret name, and the value should point to the file location.
This is particularly useful if you are running Threat Dragon in docker context, as you can use docker secrets or orchestrator such as kubernetes.

An example using docker secrets:
- Create your secrets, for example: `echo "01234567890123456789" | docker secret create github_client_id -`
- Create a docker compose file (example below)
- Deploy to your docker swarm, for example: `docker stack deploy --compose-file docker-compose.yaml owasp-threatdragon`

Example compose file:
```
version: '3.1'
services:
  threatdragon:
    # Always use a specific version tag, as "latest" may be a development build
    # Alternatively, you can use the "stable" tag, as that will always
    # be the most recently released version
    image: threatdragon/owasp-threat-dragon:v1.6.0
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
___

## Command Line
Export all of the your variables from the terminal where you will start Threat dragon.  

### MacOS / Linux
`export GITHUB_CLIENT_ID=01234567890123456789`

`export ...`

### Windows
`set GITHUB_CLIENT_ID=01234567890123456789`

`set ...`

___

## Environment variable reference

{:.table .table-striped}
| Threat Dragon general variables | Description | Default |
| --- | ----------- | ------- |
| ENV_FILE | The location of a dotenv file, if dotenv is used. Exported as it needs to be accessed before the dotenv file is read | `.env` |
| LOG_LEVEL | The server logging level: `audit` / `error` / `warn` / `info` / `debug` / `silly` | `info` |
| LOG_MAX_FILE_SIZE | Maximum size of the back-end express server log file, in MB | `24` |
| NODE_ENV | The node environment, typically `test`, `production` or `development`.  The 'secure' cookie flag is set only if running in `production` mode | |
| PORT | Defines the listening port for Threat Dragon's server, and used by Heroku | `3000`|
| SERVER_API_PROTOCOL | The protocol used between Threat Dragon's server and frontend, used by Heroku: `http` / `https` | `https` |

{:.table .table-striped}
| Back-end specific variables | Description | Default |
| --- | ----------- | ------- |
| ENCRYPTION_KEYS | The encryption keys used to encrypt any sensitive data | |
| ENCRYPTION_JWT_SIGNING_KEY | The key used to sign JWTs | |
| ENCRYPTION_JWT_REFRESH_SIGNING_KEY | The key used to sign refresh tokens. See below for rationale | |
| GITHUB_CLIENT_ID | The client_id value for the GitHub OAuth app used for authentication | |
| GITHUB_CLIENT_SECRET | The client_secret generated for the GitHub OAuth app used for authentication | |
| GITHUB_SCOPE | Defines the github scope: `repo` to access both private and public repos or `public_repo` to access public repos only | `public_repo` |

**Note:** the JWT refresh signing key should be different from the JWT signing key as they are different tokens.
A JWT is used as a refresh token because it is tamper resistant and provides user context.

{:.table .table-striped}
| Desktop specific variables | Description | Default |
| --- | ----------- | ------- |
| IS_TEST | Enabled during testing, required for Spectron | false |
| WEBPACK_DEV_SERVER_URL | Server load URL when in development mode | http://localhost:3000/ |

**Note:** the desktop environment variable WEBPACK_DEV_SERVER_URL determines either development/test
mode if defined of production mode if not defined

___
## Github OAuth App Screenshot

Example screenshot of registering a new OAuth application:

![Register new OAuth application]({{ '/assets/images/register-new-OAuth-application.png' | relative_url }})

_Threat Dragon: making threat modeling less threatening_

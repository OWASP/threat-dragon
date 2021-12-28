# [OWASP](https://www.owasp.org) Threat Dragon

## Table of Contents
1. [Quickstart](#quickstart)
1. [Create A GitHub OAuth Application](#create-a-github-oauth-application)
1. [Generate A Key](#generate-a-key)
1. [Config Via DotEnv](#config-via-dotenv)
1. [Environment Errors](#environment-errors)
1. [Session Keys](#session-keys)
1. [Command Line](#command-line)
1. [All Variables (and what they do)](#all-variables)
1. [Example Github OAuth Screenshot](#github-oauth-app-screenshot)

___

## Quickstart
1. [Create A GitHub OAuth Application](#create-a-github-oauth-application)
1. [Generate a Key](#generate-a-key) for your [Session Keys](#session-keys)
1. Copy `example.env` to `.env`
1. Update the values in `.env`
1. `npm install`
1. `npm run serve`

___

## Create A GitHub OAuth Application
This web application uses GitHub OAuth applications as the authentication mechanism.  There is [work](https://github.com/OWASP/threat-dragon/issues/1) [planned](https://github.com/OWASP/threat-dragon/issues/9) to add [additional](https://github.com/OWASP/threat-dragon/issues/61) authentication providers in the future.

There is an [open issue](https://github.com/OWASP/threat-dragon/issues/14) with regards to GitHub and OAuth permissions.

To create a GitHub OAuth Application:
1. Log into your GitHub account, go to `Settings -> 'Developer settings' -> 'OAuth Apps' -> 'New OAuth App'`
2. Fill out the form with the following:
- **Application name**: A unique identifier for the application.  This is not critical, we suggest something like 'Threat Dragon'
- **Homepage URL**: For local development, use `http://localhost:3000`
  - Threat Dragon defaults to port 3000, but is configurable.  If you plan to run it on another port, be sure to use that port instead!
- **Application description**: A description for your OAuth app.  This is not critical, we suggest something like 'Threat Dragon for local development'
- **Authorization callback URL**: `http://localhost:3000/oauth/github`
  - Again, if you plan to run Threat Dragon on another port, use that port instead!
3. Register the application, an [example screenshot](#github-oauth-app-screenshot) is at the bottom of this document
4. Create a client_secret
5. Note the values for Client ID and Client Secret. **Save these somewhere safe**
- Client ID will look similar to `01234567890123456789`
- Client Secret will look similar to `0123456789abcdef0123456789abcdef01234567`
- Treat these values like you would a password.  If these values get out, someone could gain full access to your GitHub account

___

## Generate A Key
A random 32 bit hexidecimal string should be used for session encryption.  Threat Dragon uses [express-session](https://github.com/expressjs/session#readme), who have some good advice on managing secrets.

You want this to be randomly generated, and keep it a secret.

If you have openssl installed, you can use this command to generate a new secret: `openssl rand -hex 16`

___

## Config Via DotEnv
Environment variables are configured via [dotenv](https://github.com/motdotla/dotenv#readme).  By default, Threat Dragon attempts to read key/value pairs from a `.env` file at the root of this repository.  This can be configured by exporting a file path in your terminal.  For example, on MacOS/Linux: `export ENV_FILE=/home/myawesomeuser/mydir/somefile.env`

To get started, copy [example.env](example.env) to `.env` at the root of the project and update the variables as appropriate. 

**Note**: Do not use the `export` or `set` keywork inside your env file, as this will not work from a docker context.  The `dotenv` package will automatically export the variables for you.

Alternatively, you can also set your environment variables via [command line](#command-line) if you'd prefer.

___

## Environment Errors

The application will throw an error if a required environment variable is missing during application start:
```
{"name":"threatdragon","hostname":"myAwesomePuter","pid":111111,"level":50,"msg":"GITHUB_CLIENT_ID is a required property.  Threat Dragon server cannot start without it.  Please see setup-env.md for more information","time":"2021-05-03T03:24:34.965Z","v":0}
```
___

## Session Keys

Once a user is signed in, their session information contains an OAuth access token
with write access to their GitHub repos.
For security, this is encrypted before storage in the session.
The session encryption supports multiple keys so that they can be expired
without any interruption to the running application. The primary key is always used for encryption.
Retired keys can be kept available for decrypting existing sessions.
Once all sessions are using the new primary key (typically this will be around 60 minutes maximum),
the old one can be safely removed.
The keys are stored as a JSON string in  the `SESSION_ENCRYPTION_KEYS`

* `SESSION_SIGNING_KEY` is the random 32 character hexadecimal key that you generated earlier. For example `export SESSION_SIGNING_KEY=11223344556677889900aabbccddeeff`

* `SESSION_ENCRYPTION_KEYS` has the same 32 character key,
for example `export SESSION_ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "11223344556677889900aabbccddeeff"}]'`

If you are developing locally, you can choose to store the session data in memory
using the express-session in-memory store. To do this set the `SESSION_STORE`environment variable to `local`.
As [mentioned in the express-session docs](https://github.com/expressjs/session) this is for
development only - it is not suitable for production.
To remind you of this, Threat Dragon will write a log message at severity ERROR when
it starts if the in memory session store is used.

For production use, Threat Dragon currently supports Azure Table Storage for the session store via
[connect-azuretables](https://www.npmjs.com/package/connect-azuretables).
To make this store work you need to specify an Azure Storage Account
and key as environment variables `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`.
See the [connect-azuretables](https://www.npmjs.com/package/connect-azuretables) documentation for more options.

If you want to use an [alternative session store](https://github.com/expressjs/session#compatible-session-stores)
in production, install it and edit the
[session.config.js](https://github.com/owasp/threat-dragon/blob/master/td/config/session.config.js) file.

Lastly, by default, Threat Dragon will set the `secure` flag on cookies. To override this for development purposes,
set the `NODE_ENV` environment variable to `development`. 
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
    # be the latest released version
    image: threatdragon/owasp-threat-dragon:v1.6.0
    ports:
      - 3000:3000
    environment:
      GITHUB_CLIENT_ID_FILE: /run/secrets/github_client_id
      GITHUB_CLIENT_SECRET_FILE: /run/secrets/github_client_secret
      NODE_ENV_FILE: /run/secrets/node_env
      SESSION_STORE_FILE: /run/secrets/session_store
      SESSION_SIGNING_KEY_FILE: /run/secrets/session_signing_key
      SESSION_ENCRYPTION_KEYS_FILE: /run/secrets/session_encryption_keys
    secrets:
      - github_client_id
      - github_client_secret
      - node_env
      - session_store
      - session_signing_key
      - session_encryption_keys

secrets:
  github_client_id:
    external: true
  github_client_secret:
    external: true
  node_env:
    external: true
  session_store:
    external: true
  session_signing_key:
    external: true
  session_encryption_keys:
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

## All Variables
| Key | Description | Default |
| --- | ----------- | ------- |
| NODE_ENV | The node environment.  Typically either `production` or `development`.  The `secure` flag is only set on cookies if running in `production` mode. | |
| PORT | The port which the Threat Dragon server will listen on. | `3000`
| PROXY | Causes `Strategy` to trust all broker Settings. Solve the login callback failure caused by network reasons. | |
| IS_TEST | Used for testing only | |
| SESSION_STORE | The session store provider used. `local` should be used for testing only and not in a production environment. Currently, only Azure Table Storage is configured for a production-ready solution.  Set the `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY` values to enable. | |
| SIGNING_KEY | A 32 bit hexadecimal string used by `express-session` | |
| ENCRYPTION_KEYS | The encryption keys used by `express-session`.  The value of the primary key should be the same as the `SIGNING_KEY` | |
| GITHUB_CLIENT_ID | The client_id value for the GitHub OAuth app used for authentication | |
| GITHUB_CLIENT_SECRET | The client_secret generated for the GitHub OAuth app used for authentication | |
| GITHUB_SCOPE | `repo` for access to private repos as well as public, or `public_repo` for access to public repos only | `public_repo` |
| AZURE_STORAGE_ACCOUNT | The storage account used for the session store if using Azure Table Storage.  `AZURE_STORAGE_ACCESS_KEY` must also be set if using this option. | |
| AZURE_STORAGE_ACCESS_KEY | The access key for the Azure storage account used for the session store if using Azure Table Storage.  `AZURE_STORAGE_ACCOUNT` must also be set if using this option | |

___
## Github OAuth App Screenshot

Example screenshot of registering a new OAuth application:

![Register new OAuth application](td.site/src/content/images/register-new-OAuth-application.png)

_Threat Dragon: making threat modeling less threatening_

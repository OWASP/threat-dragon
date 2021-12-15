---
layout: page
title: Webapp Installation
path: /install/web
nav_order: 2
group: Installation
---


## [OWASP](https://www.owasp.org) Threat Dragon

[Threat Dragon](http://owasp.org/www-project-threat-dragon) comes in two variants, a desktop application and a web application.

## Web application install instructions
The web application can be run locally or from a server.

### Installing

Threat Dragon is a Single Page Application (SPA) using Angular on the client and node.js on the server. To build and run locally follow these steps:

Install git and node.js - which includes the node package manager npm. To get the code, navigate to where you want your code to be located and do

`git init`

`git clone --recursive https://github.com/owasp/threat-dragon.git`

This installs code in two sub-folders. One for the main application (`td.site`) and one for the server (`td.server`). To install, do:

`npm install`

### Environment variables

Threat Dragon uses GitHub to store threat models, so you need to go to your GitHub account and
[register it as a GitHub application](https://github.com/settings/applications/new).
Once you have done that you need to set the Client ID and Client Secret as environment variables (`GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`).

You also need to set a session signing key environment variable (`SESSION_SIGNING_KEY`).
Setting up these environment variables has caused some confusion in the past,
so there is a [step-by-step guide]({{ '/development/env.html' | relative_url }}) to this. 

Once a user is signed in, their session information contains an OAuth access token with write access to their GitHub repos.
For security, this is encrypted before storage in the session. The session encryption supports multiple keys so that they can be expired
without any interruption to the running application. The primary key is always used for encryption. Retired keys can be kept available
for decrypting existing sessions. Once all sessions are using the new primary key (typically this will be around 60 minutes maximum),
the old one can be safely removed. The keys are stored as a JSON string in  the `SESSION_ENCRYPTION_KEYS` environment variable. For example:

`[{\"isPrimary\": true, \"id\": 0, \"value\": \"abcdef\"}, {\"isPrimary\": false, \"id\": 1, \"value\": \"ghijkl\"}]`

If you are developing locally, you can choose to store the session data in memory using the express-session in-memory store. To do this the
`SESSION_STORE`environment variale to `local`. As [mentioned in the express-session docs](https://github.com/expressjs/session) this is for
development only - it is not suitable for production. To remind you of this, Threat Dragon will write a log message at severity ERROR when
it starts if the in memory session store is used.

For production use, Threat Dragon currently supports Azure Table Storage for the session store via
[connect-azuretables](https://www.npmjs.com/package/connect-azuretables). To make this store work you need to specify an Azure Storage Account
and key as environment variables `AZURE_STORAGE_ACCOUNT` and `AZURE_STORAGE_ACCESS_KEY`.
See the [connect-azuretables](https://www.npmjs.com/package/connect-azuretables) documentation for more options
and information on how to set up a `session.config.js` file.

Lastly, by default, Threat Dragon will set the `secure` flag on cookies. To override this for development purposes,
set the `NODE_ENV` environment variable to `development`. 

### Running the application

Once your environment variables are set up, start the node web server:

`npm start`

If you then browse to `http://localhost:3000` you should see the running application.


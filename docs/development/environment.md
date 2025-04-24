---
layout: page
title: Development environment
nav_order: 1
path: /development/environment
group: Development
---

## Development environment

Environment variables are used to configure the Threat Dragon web application.
The desktop version of Threat Dragon does not need these variables.

Refer to the various [environment variables]({{ '/configure/configure.html' | relative_url }})
that are available to configure the web application.

A minimal set of environment variables, that will provide local file access, is:

* NODE_ENV
* ENCRYPTION_KEYS
* ENCRYPTION_JWT_SIGNING_KEY
* ENCRYPTION_JWT_REFRESH_SIGNING_KEY
* SERVER_API_PROTOCOL

### Generating keys

A random 16 byte (32 character, 256 bit) hexadecimal string should be used for encryption,
which needs to be randomly generated and kept secret.
With openssl installed use this command to generate a new 256 bit key: `openssl rand -hex 16`

This command can also be used to generate JWT signing keys.

The Express server documentation on [express-session](https://github.com/expressjs/session#readme)
has advice on managing and rotating encryption keys.

### Webapp environment variables

Export all of the your variables from the terminal where you will start Threat dragon.  

### MacOS / Linux

`export GITHUB_CLIENT_ID=deadbeef0123456789ab`

`export ...`

### Windows

`set GITHUB_CLIENT_ID=deadbeef0123456789ab`

`set ...`

### Config via DotEnv

Environment variables are configured via [dotenv](https://github.com/motdotla/dotenv#readme).
By default, Threat Dragon attempts to read key/value pairs from a `.env` file at the root of this repository.
This can be configured by exporting a file path in your terminal.
For example, on MacOS/Linux: `export ENV_FILE=/home/myawesomeuser/mydir/somefile.env`

To get started, copy `example.env` to `.env` at the root of the project and update the variables as appropriate.

Note: Do not use the `export` or `set` keywords inside your `.env` file, as this will not work from within a docker context.
The `dotenv` package will automatically export the variables for you.

Here is an example of a minimal DotEnv file, note that keys would need to be generated for it :

```text
NODE_ENV=development
ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "0123456789abcdef0123456789abcdef"}]'
ENCRYPTION_JWT_SIGNING_KEY=deadbeef112233445566778899aabbcc
ENCRYPTION_JWT_REFRESH_SIGNING_KEY=00112233445566778899aabbccddeeff
SERVER_API_PROTOCOL='http'
```

----

Threat Dragon: _making threat modeling less threatening_

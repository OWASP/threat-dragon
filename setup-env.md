## [OWASP](https://www.owasp.org) Threat Dragon ##

### Steps to set up the environment variables ###

* In your github account, go to `Settings -> 'Developer settings' -> 'OAuth Apps' -> 'New OAuth App'`

* fill out the form with the following:
**Application name**: not critical, suggest something like 'Threat Dragon'
**Homepage URL**: `http://localhost:3000`
**Application description**: not critical, suggest something like 'Threat Dragon for local development'
**Authorization callback URL**: `http://localhost:3000/oauth/github`

* Register the application, an example screenshot is at the bottom of this document

* In this new OAuth App, note the values for Client ID (something like `01234567890123456789`) and Client Secret (something like `0123456789abcdef0123456789abcdef01234567`)

* Generate a random 32 character hexadecimal key (something like `11223344556677889900aabbccddeeff`)

You now have all the info to set up the environment variables.

# Configuring Environment Variables
Environment variables can be configured by exporting variables to your terminal from which you'll be running Threat Dragon, or by using a `.env` file as described below.  

## Dotenv
Place a file named `.env` at the root of the project with your environment variables.  The `example.env` is there for reference.  The application will load any variables in this file as environment variables.

## MacOS / Linux
For MacOS and Linux go into the terminal from which you start Threat Dragon and enter at the
command line:
* GITHUB_CLIENT_ID from Client ID above, for example `export GITHUB_CLIENT_ID=01234567890123456789`
* GITHUB_CLIENT_SECRET from Client Secret above, for example `export GITHUB_CLIENT_SECRET=0123456789abcdef0123456789abcdef01234567`
* `export NODE_ENV=development`
* `export SESSION_STORE=local`
* SESSION_SIGNING_KEY as the random 32 character hexadecimal key, for example `export SESSION_SIGNING_KEY=11223344556677889900aabbccddeeff`
* SESSION_ENCRYPTION_KEYS has the same 32 character key, for example `export SESSION_ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "11223344556677889900aabbccddeeff"}]'`
* GITHUB_SCOPE - set this to `repo` if you want access also to private repos

## Windows
Similarly for Windows, from the terminal used to start Threat Dragon enter at the
command line:
* `set GITHUB_CLIENT_ID=01234567890123456789`
* `set GITHUB_CLIENT_SECRET=0123456789abcdef0123456789abcdef01234567`
* `set NODE_ENV=development`
* `set SESSION_STORE=local`
* `set SESSION_SIGNING_KEY=11223344556677889900aabbccddeeff`
* `set SESSION_ENCRYPTION_KEYS='[{"isPrimary": true, "id": 0, "value": "11223344556677889900aabbccddeeff"}]'`

You should now be able to start the threat dragon webapp using `npm run-script start` and then navigate in a browser to "http://localhost:3000/"

Example screenshot of registering a new OAuth application:


![Register new OAuth application](/td.site/content/images/register-new-OAuth-application.png)

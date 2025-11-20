---
layout: page
title: Install web application
nav_order: 2
path: /install/web
group: Install
---

## Web application installation

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) comes in two variants,
a desktop application and a web application.

The web application can be run locally or from a server.
Consider who will be able to access the web application and also the security of the platform;
the web application can be used to access various repositories which may need to be protected.

### Install

Threat Dragon is a node.js single page application using Vue on the client and Express on the server.
To build and run locally follow these steps:

Install [node.js][node], which includes the node package manager `npm`, and also install [git][git].

Obtain the code from the latest [releases area][releases] in the form of either
a `.zip` file or a `.tar.gz` file.

Extract the source tree for Threat Dragon from the archive file and
install the application dependencies using npm (or pnpm if that is installed) :

`npm install`

### Environment variables

The Threat Dragon web application requires some environment variables to be in place.
According to what variables are defined, access is provided to repository types:

- GitHub
- Bitbucket
- GitLab
- Github Enterprise

and also the client's local file system.

See the [environment]({{ '/configure/configure.html' | relative_url }}) page
for details on configuring your environment variables.

### Running the application

Once your environment variables are set up, if running on Linux or MacOS start the node web server with :

`npm start`

When running on Windows the front-end and back-end are started separately using commands:
`npm run dev:server` and `npm run dev:vue`.

Browse to `http://localhost:8080` to ensure that the Threat Dragon application
is available within the browser as a single page application.

### Building latest web application

As an alternative to using a released version of the the Threat Dragon web application,
`git` can be used to clone the latest version of the source code

```text
git init
git clone https://github.com/owasp/threat-dragon.git
cd threat-dragon
```

The source tree contains two main sub-folders:
one for the main application (`td.site`) and one for the server (`td.server`).
Install dependencies, configure and run the web application as above.

----

Threat Dragon: _making threat modeling less threatening_

[git]: https://git-scm.com/downloads/
[node]: https://nodejs.org/en/download
[releases]: https://github.com/OWASP/threat-dragon/releases/

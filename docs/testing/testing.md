---
layout: page
title: Testing
nav_order: 0
path: /testing
group: Testing
---

## Testing

During development it can be convenient to manually check functionality of the
front and back ends which is not part of the unit and end-to-end tests.

### Backend server

The web application express server can be run locally using command `npm run start:server` from the top level directory.
The server will need access to environment variables as shown in
[environment setup](/install-environment/).

When running locally it may be that HTTPS certificates are not present,
so consider using these environment variables that use HTTP:

```text
NODE_ENV=development
LOG_LEVEL=debug
SERVER_API_PROTOCOL=http
```

A browser can be used to access the server, or other command line tools such as curl:

```text
curl -v http://localhost:3000/api/threatmodel/organisation  \
     -H "Accept: application/json"
```

### Desktop server

The desktop application uses electron as the back-end server.
Use command `npm run start:desktop` to run the application in development mode,
it will rebuild and launch when source files are changed.

### Frontend application

The front end application can be tested in most browsers along with the browser supplied developer tools.
If the application is being tested in the desktop environment then electron uses
chrome as the renderer, with chrome developer tools being available.

----

Threat Dragon: _making threat modeling less threatening_

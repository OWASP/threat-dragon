---
layout: page
title: AdHoc Testing
nav_order: 2
path: /testing/adhoc
group: Testing
---

# Ad-Hoc Testing

During development it can be convenient to check functionality of the front and back ends
in an ad-hoc way which is not part of the unit and end-to-end tests. 

## Back-end server
The web application express server can be run locally using command `pnpm start:server` from the top level directory.
The server will need access to environment variables as shown in [environment setup]({{ 'development/environment.html' | relative_url }}).

When running locally it may be that HTTPS certificates are not present; consider using these environment variables:

```
NODE_ENV=development
LOG_LEVEL=debug
SERVER_API_PROTOCOL=http
```

A browser can be used to access the server, or other command line tools such as curl: 

```
curl -v http://localhost:3000/api/threatmodel/organisation  \
     -H "Accept: application/json"
```

## Desktop server
The desktop application uses electron as the back-end server.
Use command `pnpm start:desktop` to run the application in development mode,
it will rebuild and launch when source files are changed.

## Front-end application
The front end application can be tested in most browsers along with the browser supplied developer tools.
If the application is being tested in the desktop environment then electron uses
chrome as the renderer, with chrome developer tools being available.

# Developer notes for [OWASP](https://www.owasp.org) [Threat Dragon](https://owasp.org/www-project-threat-dragon/) version 2 #

## Overview ##

This is a collection of notes used during development, most of which should be up to date - if not then raise an issue.
The recipes are for both Windows and Linux/MacOS; in general the `npm` and `git` commands are the same on all platforms,
but some of the commands (eg `cd ../..`) need to be modified if running on a Windows platform.

Threat Dragon is a [node.js](https://nodejs.org)
[single page application](https://en.wikipedia.org/wiki/Single-page_application) built on the
[Angular](https://angular.io/) framework.
It comes in two variants, this [web application](https://github.com/OWASP/threat-dragon)
and also a [desktop application](https://github.com/OWASP/threat-dragon-desktop).

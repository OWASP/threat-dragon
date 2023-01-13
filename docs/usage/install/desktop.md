---
layout: page
title: Desktop Installation
nav_order: 1
path: /install/desktop
group: Installation
---

## [OWASP](https://www.owasp.org) Threat Dragon

[Threat Dragon](http://owasp.org/www-project-threat-dragon) comes in two variants, a desktop application and a web application.

## Desktop application install instructions
Installable versions are available for download from the [OWASP GitHub area](https://github.com/OWASP/threat-dragon/releases):

* Windows (64 bit) installer
* MacOS installer
* Linux snap, AppImage, debian and rpm installers

### Linux installer and AppImage
Packages for both Debian and Fedora Linux on AMD64 and X86-64bit platforms can be downloaded from the
[releases folder](https://github.com/OWASP/threat-dragon/releases/).
Alternatively a platform independent snap installer can be downloaded, or use the AppImage provided.

### MacOS installer
Download the .dmg MacOS installer from the
[releases folder](https://github.com/OWASP/threat-dragon/releases/).
Open the download and drag 'OWASP Threat  Dragon' to the application directory. When the copy has
finished then Threat  Dragon can be run from launchpad or from Finder -> Applications.

### Windows installer
Download the Windows .exe installer from the
[releases folder](https://github.com/OWASP/threat-dragon/releases/).
Run the installer and invoke the application from the shortcut.

### Command line using npm

For the latest versions of code between releases, `pnpm` and `npm` can be used to install and run Threat Dragon locally:

`git clone https://github.com/owasp/threat-dragon`

`cd threat-dragon`

`pnpm install`

To run Threat Dragon in development mode:

`npm run start:desktop`

To build an installer:

`npm run build:desktop`

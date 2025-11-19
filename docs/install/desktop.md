---
layout: page
title: Install desktop application
nav_order: 1
path: /install/desktop
group: Install
---

## Desktop install

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) comes in two variants,
a desktop application and a web application.

To install the desktop application, use the installers available for download from the [OWASP GitHub area][releases]:

* Windows (64 bit) executable / NSIS installer
* MacOS installers (.dmg) for X86 and Apple silicon
* Linux AppImage used for most Linux distributions and hardware platforms
* Linux Snap image is available from the [official snapcraft distribution][snap]
* Package `.rpm` for Red Hat Linux, AIX, CentOS, Fedora
* Package `.deb` for debian based Linux such as Ubuntu, Trisqel and Debian itself

### Linux installer and AppImage

Packages for both Debian and Fedora Linux on AMD64 and X86-64bit platforms
can be downloaded from the [releases area][releases].
Platform independent application installers Snap and AppImage are also provided.

### MacOS installer

Download the `.dmg` MacOS installer from the [releases area][releases].
Open the download and drag 'OWASP Threat  Dragon' to the application directory.
When the install has finished, run Threat  Dragon from launchpad or from Finder / Applications.

### Windows installer

Download the Windows `.exe` installer from the [releases area][releases].
Run the installer and invoke the application from the shortcut.

### Desktop application build instructions

As an alternative to using a released version of the the Threat Dragon desktop application,
`npm` can be used to install and run Threat Dragon locally:

```text
git clone https://github.com/owasp/threat-dragon
cd threat-dragon
npm install
```

This allows access to the latest code updates between releases,

To run the Threat Dragon desktop application in development mode:

`npm run start:desktop`

To build an installer:

`npm run build:desktop`

----

Threat Dragon: _making threat modeling less threatening_

[releases]: https://github.com/OWASP/threat-dragon/releases/
[snap]: https://snapcraft.io/threat-dragon

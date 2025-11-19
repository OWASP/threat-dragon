---
layout: page
title: Installation
nav_order: 0
path: /install
group: Install
---

## Installation

[Threat Dragon](https://owasp.org/www-project-threat-dragon/) comes in two variants,
a desktop application and a web application.

### Web application

The web application can be run locally or from a server, and is downloaded from the [Threat Dragon repo][releases].
There is some configuration necessary, so see the
[install instructions]({{ '/install/web.html' | relative_url }}) for configuring the application.

The web application is also provided in a Docker image, and this is provided by [dockerhub][docker].
Follow the Docker [instructions]({{ '/install/docker.html' | relative_url }})
to download, configure and run a Docker container.

### Desktop application

Various installers can be downloaded from the Threat Dragon [releases area][releases]:

* Windows (64 bit) executable / installer
* MacOS installers (.dmg) for X86 and Apple silicon
* Linux AppImage used for most Linux distributions and hardware platforms
* Linux Snap image is available from the [official snapcraft distribution][snap]
* Package `.rpm` for Red Hat Linux, AIX, CentOS, Fedora
* Package `.deb` for debian based Linux such as Ubuntu, Trisqel and Debian itself

See the desktop [install instructions]({{ '/install/desktop.html' | relative_url }}).

----

Threat Dragon: _making threat modeling less threatening_

[docker]: https://hub.docker.com/r/owasp/threat-dragon/tags
[releases]: https://github.com/OWASP/threat-dragon/releases
[snap]: https://snapcraft.io/threat-dragon

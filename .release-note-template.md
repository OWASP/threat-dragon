### What's Changed

### Web application

The web application is provided as a [.tar.gz file][tar] or a [.zip file][zip]
along with [SBOMs](#software-bill-of-materials).

#### Docker containers

The docker images are available from [Dockerhub][docker]:

- For X86 platforms pull the image: `docker pull --platform linux/x86_64 owasp/threat-dragon:v2.x.x`
- Alternatively for ARM64 platforms: `docker pull --platform linux/arm64 owasp/threat-dragon:v2.x.x-arm64`

### Desktop version

|Platform | File | SHA512 |
|-- | -- | -- |
|Windows NSIS installer | [Threat-Dragon-ng-Setup-2.x.x.exe][exe] | [checksum.yml][execs] |
|MacOS installer x86 | [Threat-Dragon-ng-2.x.x.dmg][dmg] | [checksum-mac.yml][dmgcs] |
|MacOS installer ARM64 | [Threat-Dragon-ng-2.x.x-arm64.dmg][dmgarm64] | [checksum-mac-arm64.yml][dmgcsarm64] |
|Linux AppImage | [Threat-Dragon-ng-2.x.x.AppImage][app] | [checksum-linux.yml][appcs] |
|Debian package, AMD64 | [threat-dragon_2.x.x_amd64.deb][deb] |  |
|Redhat package manager, X86 64 bit | [threat-dragon-2.x.x.x86_64.rpm][rpm] |  |
|Linux Snap | [direct from Snapcraft][snap] |  |

### Software Bill of Materials

SBOMs are provided for the [server][server] and for the [frontend][frontend] application including desktop.

#### Installing on Windows

Download and run the NSIS executable. Depending on the security applied in your Windows system,
you may need to open the file properties and check the 'Unblock' checkbox to allow Threat Dragon to run

#### Installing on MacOS

To install on MacOS systems download and run the disk image `.dmg` file , either the x86 or arm64 version.
Note that the MacOS `.zip` files are used for automatic updates, and are not recommended for installation.

#### Installing on Linux

Select the method that is most convenient for your distribution of Linux:

- `AppImage` can be used for most Linux distributions and hardware platforms
- a Snap image is available from the [official Snapcraft distribution][snap]
- `.rpm` for Red Hat Linux, AIX, CentOS, Fedora
- `.deb` for debian based Linux such as Ubuntu, Trisqel and Debian itself

[app]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/Threat-Dragon-ng-2.x.x.AppImage
[appcs]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/checksum-linux.yml
[deb]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/threat-dragon_2.x.x_amd64.deb
[dmg]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/Threat-Dragon-ng-2.x.x.dmg
[dmgarm64]: https://github.com/OWASP/threat-dragon/releases/download/v2.3.0/Threat-Dragon-ng-2.x.x-arm64.dmg
[dmgcs]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/checksum-mac.yml
[dmgcsarm64]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/checksum-mac-arm64.yml
[docker]: https://hub.docker.com/r/owasp/threat-dragon
[exe]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/Threat-Dragon-ng-Setup-2.x.x.exe
[execs]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/checksum.yml
[frontend]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/sboms.zip
[rpm]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/threat-dragon-2.x.x.x86_64.rpm
[server]: https://github.com/OWASP/threat-dragon/releases/download/v2.x.x/sboms-server.zip
[snap]: https://snapcraft.io/threat-dragon
[tar]: https://github.com/OWASP/threat-dragon/archive/refs/tags/v2.x.x.tar.gz
[zip]: https://github.com/OWASP/threat-dragon/archive/refs/tags/v2.x.x.zip

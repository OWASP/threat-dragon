---
layout: page
title: About
nav_order: 0
path: /about
group: About
---

## [OWASP](https://www.owasp.org) Threat Dragon

[Threat Dragon](http://owasp.org/www-project-threat-dragon) is a free, open-source, 
cross-platform [threat modeling](https://owasp.org/www-community/Threat_Modeling)
application including system diagramming and a rule engine to auto-generate threats/mitigations.
Threat Dragon supports STRIDE<sup>[1](#footnote1)</sup>, LINDDUN<sup>[2](#footnote2)</sup> and CIA<sup>[3](#footnote3)</sup>.

It is an [OWASP Lab Project](https://owasp.org/projects/)
and follows the values and principles of the threat modeling [manifesto](https://www.threatmodelingmanifesto.org/).
An [introduction](https://www.youtube.com/watch?v=hUOAoc6QGJo) to Threat Dragon is provided by
the [OWASP Spotlight](https://www.youtube.com/playlist?list=PLUKo5k_oSrfOTl27gUmk2o-NBKvkTGw0T) series,
and a different take on Threat Dragon is provided by [Threat Modeling Gamification](https://www.youtube.com/watch?v=u2tmLrwv-nc).

There is a good overview of [threat modeling and risk assessment](https://owasp.org/www-community/Application_Threat_Modeling)
from OWASP, and this expands on what the Threat Dragon project aims for: 
* designing the data flow diagram
* automatic determining and ranking threats
* suggested mitigations
* entry of mitigations and counter measures

The application comes in two variants:

1. [**A desktop application**](https://github.com/owasp/threat-dragon/releases): This uses
[Electron](https://electron.atom.io/) to run the application, with model files stored on the local filesystem.
There are installers available for Windows, Mac OSX and Linux.

1. [**A web application**](https://github.com/owasp/threat-dragon/releases): For the web application model files
are stored in GitHub, with other storage methods to follow.

The following translations are built into the Threat Dragon application:

- English (eng-US)
- Ελληνικά (ell-GR)
- español (spa-ES)
- français (fra-CA)
- मानक हिन्दी (hin-IN)
- português (por-BR)
- 中文 (zho-CN)

### Demonstration site
Threat Dragon maintains a [Demo Instance](https://www.threatdragon.com/) that is hosted on [Heroku](https://www.heroku.com/).
We strongly recommend using a self-hosted instance or the desktop application as the most secure options.
Threat Dragon can authenticate to GitHub repositories using a GitHub OAuth application as noted in the [environment setup](development/environment) page. 
____
<p>
<sup><a name="footnote1">1</a>: Spoofing, Tampering, Repudiation, Information disclosure, DoS, Elevation of privilege</sup><br>
</p>
<p>
<sup><a name="footnote2">2</a>: Linkability, Identifiability, Non-repudiation, Detectability, Disclosure of information, Unawareness, Non-compliance</sup><br>
</p>
<p>
<sup><a name="footnote3">3</a>: Confidentiality, Integrity, Availability</sup>
</p>

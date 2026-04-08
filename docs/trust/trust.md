---
layout: page
title: Trust
nav_order: 0
path: /trust
group: Trust
---

## Trust

The Threat Dragon development team build security into the application and the supply chain.
Some examples of this are:

* the code repository enforces signed commits which helps filter out malicious activity
* the supply chain actions are identified using a full-length SHA
* the desktop installer releases are signed and notarized where possible

### Continual testing

The automated security scans of Threat Dragon are run on every commit:

* [Dependency management]({{ '/trust/dependencies.html' | relative_url }})
* [SAST]({{ '/trust/sast.html' | relative_url }})
* [DAST]({{ '/trust/dast.html' | relative_url }})
* [Container scanning]({{ '/trust/container.html' | relative_url }})

### Incident Response

Report security vulnerabilities found within Threat Dragon by following the process in
the [Security Policy](https://github.com/OWASP/threat-dragon/blob/main/security.md).
Every effort will be made to resolve security concerns as they arise.

Threat Dragon is open source software and contains many other open source components.
Threat Dragon's community strives to stay abreast of security vulnerabilities
and incidents impacting upstream providers or Threat Dragon itself.

If there is a high impact or high profile incident or vulnerability,
the Threat Dragon community/maintainers will create a [GitHub Issue](https://github.com/owasp/threat-dragon/issues)
and leave it pinned for as long as it is relevant to the community.
This issue will have the "security" label, and is intended to serve as a transparency report,
not necessarily a real-time feed of incident response.

Threat Dragon is maintained by a community of volunteers and so
it will not always be possible to immediately investigate or immediately respond to incidents,
but this community will do its best.

----

Threat Dragon: _making threat modeling less threatening_

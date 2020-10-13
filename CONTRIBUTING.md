# Contributing to OWASP Threat Dragon
Threat Dragon is a community project, and we are always delighted to welcome new contributors!

There are several ways you can contribute:

## Got a Question or Problem?
If you have a question or problem relating to using Threat Dragon then the first thing to do is to check the
[Frequently Asked Questions](https://owasp.org/www-project-threat-dragon/#div-faqs) tab on the [OWASP project page](https://owasp.org/www-project-threat-dragon/).
Threat Dragon documentation is [available online](https://threatdragon.github.io).

If this does not help then ask one of the [leaders / collaborators](https://github.com/OWASP/www-project-threat-dragon/blob/master/leaders.md).

## Found an Issue?
If you have found a bug then raise an issue on the Threat Dragon
[core repo](https://github.com/OWASP/threat-dragon-core/issues/new?assignees=&labels=bug&template=bug_report.md&title=).

It is worth checking to see if its [already been reported](https://github.com/OWASP/threat-dragon-core/issues),
and including as much information as you can to help us diagnose your problem.

## Found a Vulnerability?
If you think you have found a vulnerability in Threat Dragon then please report it to our
[leaders / collaborators](https://github.com/OWASP/www-project-threat-dragon/blob/master/leaders.md).

We are always very grateful to researchers who report vulnerabilities responsibly and will be very happy
to give any credit for the valuable assistance they provide.

## Have a Feature Request?
If you have a suggestion for new functionality then you can raise this request in an issue on the Threat Dragon
[core repo](https://github.com/OWASP/threat-dragon-core/issues/new?assignees=&labels=enhancement&template=feature_request.md&title=).

Again it is worth checking to see if its [already been reported](https://github.com/OWASP/threat-dragon-core/issues), 
and include as much information as you can so that we can fully understand your requirements.

## Coding
There is always lots of coding to be done! Threat Dragon is split into 3 repos, all of which need contributions:
* [TD webapp repo](https://github.com/OWASP/threat-dragon/issues)
* [TD desktop app repo](https://github.com/OWASP/threat-dragon-desktop/issues)
* [TD core repo](https://github.com/OWASP/threat-dragon-core/issues)

There are some [Development Notes](dev-notes.md) that should help you to get started, as well as a template for the [Pull Requests](.github/PULL_REQUEST_TEMPLATE.md).

### Improve Existing Threat Engine or Write New Ones
The threat engines define how Threat Dragon can automatically suggest threats which could uncover vulnerabilities.

We are always looking to improve [existing engine rules](src/services/threatengine.js)
and add new ones, so this is a great place to start helping with the Threat Dragon code base.

---
layout: page
title: Contributing
nav_order: 2
path: /development/contributing
group: Development
---

## Contributing

Pull requests, feature requests, bug reports and feedback of any kind are very welcome, please refer to the page for
[contributors](https://github.com/OWASP/threat-dragon/blob/main/contributing.md).

We are trying to keep the test coverage relatively high, so please try to update tests in any PRs.
There are some [developer notes]({{ '/development/development.html' | relative_url }})
to help you get started with this project.

### Quick start

Clone and install the Threat Dragon repo:

```text
git clone git@github.com:OWASP/threat-dragon.git
cd threat-dragon
npm install
```

After making any changes be sure to test them:

```text
npm start
npm test
npm run test:vue
```

### Vulnerability disclosure

If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority.
For secure disclosure, please see the [security policy](https://github.com/OWASP/threat-dragon/blob/main/security.md).

----

Threat Dragon: _making threat modeling less threatening_

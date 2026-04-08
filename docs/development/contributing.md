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

The Threat Dragon main branch only accepts signed commits, otherwise the contribution will be rejected.
Signed commits help to filter out malicious activity,
see the Github documentation on [commit signature verification][signed-commits].

### Quick start

Clone and install the Threat Dragon repo:

```sh
git clone git@github.com:OWASP/threat-dragon.git
cd threat-dragon
npm install
```

After making any changes be sure to test them:

```sh
npm start
npm test
npm run test:vue
```

### Vulnerability disclosure

If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority.
For secure disclosure, please see the [security policy](https://github.com/OWASP/threat-dragon/blob/main/security.md).

----

Threat Dragon: _making threat modeling less threatening_

[signed-commits]: https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification

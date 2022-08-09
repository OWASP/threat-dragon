---
layout: page
title: Contributing
path: /about/contribute
nav_order: 1
group: About
---

## [OWASP](https://www.owasp.org) Threat Dragon

### Contributing

Pull requests, feature requests, bug reports and feedback of any kind are very welcome, please refer to the page for
[contributors](https://github.com/OWASP/threat-dragon/blob/main/CONTRIBUTING.md). 

We are trying to keep the test coverage relatively high, so please try to update tests in any PRs.
There are some [developer notes]({{ '/development/local.html' | relative_url }}) to help you get started with this project.

### Quick start
Clone and install the Threat Dragon repo:

```
git clone git@github.com:OWASP/threat-dragon.git
cd threat-dragon
pnpm install
```

After making any changes be sure to test them:

```
npm start
npm test
npm run test:vue
```


### Vulnerability disclosure

If you find a vulnerability in this project please let us know ASAP and we will fix it as a priority.
For secure disclosure, please see the [security policy](https://github.com/OWASP/threat-dragon/blob/main/SECURITY.md).

### Project leaders

[Mike Goodwin](mailto:mike.goodwin@owasp.org)

[Jon Gadsden](mailto:jon.gadsden@owasp.org)

[Leo Reading](mailto:leo.reading@owasp.org)

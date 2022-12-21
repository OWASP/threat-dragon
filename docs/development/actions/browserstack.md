---
layout: page
title: BrowserStack
nav_order: 2
path: /actions/browserstack
group: Actions
---
# BrowserStack

[BrowserStack](https://www.browserstack.com/) offers its services
[for free to open-source projects](https://www.browserstack.com/open-source),
and has graciously provided Threat Dragon with their services.
BrowserStack provides automated, cross-browser testing for web and mobile applications.

Thunderhead leverages BrowserStack to check compatability across different browsers.
The [e2e page]({{ 'development/testing/e2e.html' | relative_url }}) has a complete browser testing matrix.

Because cross browser testing has diminishing returns,
it is only run against the latest deployed version (from main) once per day.

An example of what the results might look like:
![BrowserStack Results]({{ '/assets/images/browserstack_result.png' | relative_url }}){:.img .img-fluid}

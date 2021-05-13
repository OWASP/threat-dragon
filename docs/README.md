# [OWASP](https://www.owasp.org) Threat Dragon #

[![OWASP ZAP scan](https://github.com/threatdragon/threatdragon.github.io/actions/workflows/zap_scan.yaml/badge.svg)](https://github.com/threatdragon/threatdragon.github.io/actions/workflows/zap_scan.yaml)

This repo provides the [documentation site](https://threatdragon.github.io)
for [Threat Dragon](http://owasp.org/www-project-threat-dragon).

Threat Dragon is a threat modelling application which provides model diagramming and a rule engine to auto-generate threats/mitigations. 
The future of this project will be to focus will be on a powerful rule engine
and integration with other development lifecycle tools.

Threat Dragon is an [OWASP Incubator Project](https://owasp.org/www-project-threat-dragon/),
please contribute your ideas and time if you can.

## Testing the docs pages
* make sure you have jekyll installed, following the
[github docs](https://docs.github.com/en/github/working-with-github-pages/testing-your-github-pages-site-locally-with-jekyll)
* install with `bundle install`
* run the site locally with `bundle exec jekyll serve`
* browse to http://localhost:4000/ to check all is good
* build the site with `bundle exec jekyll build`

### Project leaders:
* [Mike Goodwin](mailto:mike.goodwin@owasp.org)
* [Jon Gadsden](mailto:jon.gadsden@owasp.org)

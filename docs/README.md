## Threat Dragon documentation

This docs directory provides the documentation site at `https://www.threatdragon.com/docs/`

The [owasp-td-jekyll](https://github.com/lreading/owasp-td-jekyll) theme provides
the header bar for the documentation site (such as flask, cloud etc).

### Running Locally

If you do not already have Jekyll or Ruby installed, see [Jekyll's Guide](https://jekyllrb.com/docs/installation/).

MacOS users should use chruby instead of the system ruby:

* Install bundle globally: `npm add --location=global bundle`
* Install jekyll, webrick etc: `cd docs && bundle update`
* Run the docs server (version syncs automatically): `npm run docs:serve`
* Navigate in a browser to server address: `http://127.0.0.1:4000/`

To build the docs site without serving: `npm run docs:build`

### Check for updates

It is good to note out-dated gem packages:

* `bundle outdated`
* `bundle update`

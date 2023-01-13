## Threat Dragon documentation
This docs directory provides the documentation site at https://www.threatdragon.com/docs/

It uses `owasp-td-jekyll` as a theme from https://github.com/lreading/owasp-td-jekyll.
The theme provides the header bar for the documentation site (such as flask, cloud etc).


### Running Locally
If you do not already have Jekyll or Ruby installed,
see [Jekyll's Guide](https://jekyllrb.com/docs/installation/).

Note that MacOS users are advised to use chruby instead of the system ruby.

* From a terminal navigate to this `docs` directory
* Install/update bundle: `npm add --location=global bundle`
* Install jekyll, webrick etc: `bundle update`
* Run the docs server: `bundle exec jekyll serve`
* Navigate in a browser to server address: http://127.0.0.1:4000/

### Check for updates
It is good to keep an eye on out-dated gem packages:

* `bundle outdated`
* `bundle update`

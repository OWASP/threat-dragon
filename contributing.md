# Contributing to OWASP Threat Dragon

Threat Dragon is a community project and new contributors are always welcome

When contributing:

* see if there is [already an issue][issues] for what you want to do
* get started by following the [developer notes][dev]
* keep the test coverage high with unit tests and functional tests

## Ground rules

* follow our [Code of Conduct](code_of_conduct.md)
* follow our restrictions on the use of (generative) AI
* ensure that [unit tests][unit] have been extended or created for any code changes
* if the contribution changes the functionality then ensure that the [functional tests][e2e] are created or modified
* the use of generative AI is not prohibited but must be declared in the pull request

## Got a Question or Problem?

If you have a question or problem relating to using Threat Dragon then the first thing to do is to check the
[Frequently Asked Questions][faqs] tab on the [OWASP project page][project].
Threat Dragon documentation is [available online][docs].

If this does not help then one of the [leaders / collaborators][leaders] should be able to help.

## Found an Issue?

If you have found a bug then raise an issue on [Threat Dragon][raise], and make sure you have logged into github first.

It is worth checking to see if its [already been reported][issues],
and including as much information as you can to help us diagnose your problem.

## Found a Vulnerability?

If you think you have found a vulnerability in Threat Dragon then please report it
to our [leaders / collaborators]([leaders].

We are always very grateful to researchers who report vulnerabilities responsibly and are very happy
to give all credit for the valuable assistance they provide.

## Have a Feature Request?

If you have a suggestion for new functionality then you can raise this request as an issue on [Threat Dragon][request].

Worth checking to see if its [already been reported][issues],
and include as much information as you can so that we can fully understand your requirements.

## Coding

There is lots of coding to be done! Threat Dragon welcomes contributions and issues: [TD github repo][issues]

Having said that, Threat Dragon is an open-source project run by volunteers in our spare time;
we may not be able to respond quickly nor provide support to any great extent.

The best chance of success for a pull request to be reviewed and accepted:

1. make sure there is an existing issue that the pull request is solving / fixing
2. provide a short but informative title
3. provide enough description to explain how Threat Dragon worked before and works after the change
4. extend the unit tests and functional tests to show the change working as expected
5. the pull request must provide one change only, if there are further changes use further pull requests
6. be cautious when coding using generative AI, please understand fully the changes and keep sprawl to a minimum

We appreciate contributions always.

### Use of AI

You must declare any use of generative or agentic AI in pull requests or when creating / commenting on issues.
Failure to do this may result in the pull request or issue being closed or even deleted.

There are various reasons why the project leaders have had to adopt this robust approach, some of them are:

* when used to generate documentation pages the content is often verbose and incorrect; documentation has to be correct
* generative AI code often just does not work.
  For example it can refer to functions that do not exist and can use an incompatible coding style
* AI assisted pull requests often do not split out changes into individual pull requests
* issues created with AI assistance are often verbose and of low priority

Be mindful that the leaders and maintainers of Threat Dragon are volunteers with their own day jobs;
we do this on our own time for the benefit of the open source community and OWASP in particular.
Please make sure your issues and pull requests are well thought out and actually work, you will then get a better response.

----

Threat Dragon: _making threat modeling less threatening_

[dev]: https://www.threatdragon.com/docs/development/development.html
[docs]: https://www.threatdragon.com/docs/
[e2e]: https://www.threatdragon.com/docs/testing/e2e.html
[faqs]: https://owasp.org/www-project-threat-dragon/#div-faqs
[issues]: https://github.com/OWASP/threat-dragon/issues
[leaders]: https://github.com/OWASP/www-project-threat-dragon/blob/main/leaders.md
[project]: https://owasp.org/www-project-threat-dragon/
[raise]: https://github.com/OWASP/threat-dragon/issues/new?assignees=&labels=bug&template=bug_report.md&title=
[request]: https://github.com/OWASP/threat-dragon/issues/new/choose
[unit]: https://www.threatdragon.com/docs/testing/unit.html

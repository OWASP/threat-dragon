---
layout: page
title: Plugins
nav_order: 6
path: /development/plugins
group: Development
---

## Threat Dragon plugin system

Plugins are a way to add optional and complementary functionality to the Threat Dragon desktop client.
_Plugins are not required in order to threat model_.
Plugins are contained in the main [Threat Dragon repository][td_repo].
This helps avoid the potential attack vector of a malicious plugin, as all plugin code is reviewed and
maintained using the same standards and controls as the rest of Threat Dragon.

## Why desktop only?

When installing or running Threat Dragon's web application, most administrators will need to configure some
environment variables to ensure that Threat Dragon works in their particular environment. For this reason,
any optional features for the web application will be controlled by environment variables.

The desktop client is intended to be a single, standalone client with minimal configuration and setup.
The desktop client installers and executables are created using Electron, and all runtime dependencies
should be satisfied by that bundling process.

## Available plugins

The only current plugin is the [AI tools plugin]({{ '/usage/ai-tools.html' | relative_url }}).
This gives users the ability to leverage large language models as part of their threat modeling process,
but users have to opt-in to enabling and using this feature.

## Developing plugins

Plugins should:

- Not break existing features or add regressions
- Be an optional part of the threat modeling experience
- Add unique capabilities that are not already available in Threat Dragon
- Adhere to the same security and quality standards as the rest of Threat Dragon, and live inside
the Threat Dragon repository

### Language choice

By default, plugins should be written using JavaScript. This aligns with the rest of the codebase
and removes the need to bundle additional runtimes. JavaScript-based plugins will integrate seamlessly
with the Electron environment and do not require additional runtime dependencies.

There are times when JavaScript may not be suitable for a specific task.
The [AI tools plugin]({{ '/usage/ai-tools.html' | relative_url }}) is a great example of this.
It uses [litellm][litellm], which at the time of writing does not have a JavaScript equivalent with
full feature parity. Python was the best choice for developing the plugin.

### Runtime dependencies and portability

If using a language other than JavaScript, runtime dependencies should be considered.
User experience suffers if we start to require installation of third party software in order to use
the standalone desktop client. We would like to limit the number of languages and bundled runtimes,
as this has a big impact on the installer size and can quickly bloat the client.

The [AI tools plugin]({{ '/usage/ai-tools.html' | relative_url }}) was written in Python.
This created a need for Python to be available at runtime.
Because _most_ Linux distros have Python 3 installed by default, and most Mac users have access
to Homebrew, it was [decided][ai_tools_pr] that we should bundle a portable Windows Python executable
and rely on path resolution for Unix-like systems.

If future Python-based plugins are added, we should centralize the Python bundling and management across multiple plugins.

----

Threat Dragon: _making threat modeling less threatening_

[td_repo]: https://github.com/OWASP/threat-dragon/
[litellm]: https://github.com/OWASP/threat-dragon/issues/197
[ai_tools_pr]: https://github.com/OWASP/threat-dragon/pull/1404/#issuecomment-3786503784

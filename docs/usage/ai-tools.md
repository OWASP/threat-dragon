---
layout: page
title: AI Tools
nav_order: 1
path: /usage/ai-tools
group: Plugins
---

## AI tools plugin

### Overview

The AI tools plugin allows Threat Dragon desktop users to leverage a wide variety of large language
models for **generating threats and mitigations in an existing model**. The AI tools plugin was developed
by [InfosecOTB](https://github.com/InfosecOTB) after researching how large language models could assist
with threat modeling. After a [GitHub discussion](https://github.com/OWASP/threat-dragon/discussions/1358),
he began integrating those findings with Threat Dragon.

Additional documentation and details can be found in the
[AI tools README](https://github.com/OWASP/threat-dragon/blob/main/td.vue/ai-tools/README.md).

### Research

- [AI-Powered Threat Modeling with OWASP Threat Dragon – Part 1: Creating a Data Flow Diagram](https://infosecotb.com/using-owasp-threat-dragon-and-artificial-intelligence-ai-for-threat-modelling-part-1-creating-a-data-flow-diagram/)
- [AI-Powered Threat Modeling with OWASP Threat Dragon – Part 2: Generating Threats with Artificial Intelligence](https://infosecotb.com/ai-powered-threat-modeling-with-owasp-threat-dragon-part-2-generating-threats-with-artificial-intelligence/)
- [Additional discussion on using locally hosted or small LLMs](https://github.com/OWASP/threat-dragon/pull/1404/)

### Configuration

To use the AI tools plugin, you must first configure it via the AI Tools -> Settings dropdown.

![AI Tools -> Settings]({{ '/assets/images/ai-tools-settings-dropdown.png' | relative_url }}){: width="400" }

The Settings window has multiple configuration parameters. These settings are a subset
of [litellm's configuration](https://docs.litellm.ai/docs/set_keys), focused on what is needed for
Threat Dragon integration. With the exception of `API Key`, settings are stored in Threat Dragon's
configuration directory in `ai-settings.json`. Because the `API Key` is sensitive, it is stored
using [Electron's `safeStorage` API][electron_safestorage], which ensures that the `API Key` is
always encrypted at rest. OS-specific safeStorage implementation details are covered later.

![Settings Screen]({{ '/assets/images/ai-tools-settings-screen.png' | relative_url }}){: width="400" }

The following settings are available:

{: .table .table-striped }

| Setting | Default | Required | Description |
| --- | --- | --- | --- |
| `API Key` | N/A | Required unless `API Base` is set | The API key used to authenticate with the LLM provider you have chosen |
| `LLM Model` | N/A | Yes | A [litellm provider/model](https://docs.litellm.ai/docs/providers) string. For example, `openai/gpt-5` is a valid model. Model validation runs when generating threats, not when saving settings. |
| `Temperature` | 0.1 | Yes | The model [temperature](https://docs.litellm.ai/docs/proxy/cli#--temperature), typically between 0 and 1, with lower values resulting in more deterministic responses. Each model can have its own thresholds for valid temperatures. |
| `Structured Format (JSON)` | False | No | Some models support [structured outputs](https://docs.litellm.ai/docs/completion/json_mode). **Enabling this setting [greatly improves](https://github.com/OWASP/threat-dragon/pull/1404/#issuecomment-3764388800) the accuracy and consistency of generated threats and mitigations**. |
| `API Base` | N/A | No | If your LLM provider does not use a shared base URL, enter the base URL here. For example, Azure gives users unique endpoints to use, or if you are using a local LLM option like Ollama, you will need to set the endpoint here. |
| `Log Level` | Info | Yes | Set to `DEBUG` for additional context and logging. Please see the "Logging" section below. |
| `Timeout` | 900 | Yes | The amount of time, in seconds, before aborting LLM calls. If using smaller LLMs or ones with deep reasoning, you may need to increase this. |

### Usage

#### Prerequisites

- The AI tools plugin is configured via the Settings menu
- Threat Model Requirements:
  - The threat model must already exist
  - There must be one or more diagrams in the model. This plugin does not _create) diagrams;
  it generates threats and mitigations for the existing diagrams.
  - You must not have a diagrams open. You should be on the model screen when launching the AI tools plugin.

Once the prerequisites are met, you can launch the AI tools plugin by selecting
"AI Tools -> Generate Threats and Mitigations" from the menu. **You must acknowledge the
AI warning before continuing**.

![AI Warning]({{ '/assets/images/ai-tools-ai-warning.png' | relative_url }}){: width="400" }

Depending on your system and the provider/model selected, the inference can take some time.
You will see the following screen while it is processing:

![LLM Processing]({{ '/assets/images/ai-tools-processing.png' | relative_url }}){: width="400" }

After it is done processing, you will see the validation screen.

**It is up to you to validate the generated threats and mitigations. You must save the threat model
after generating the threats and mitigations.**

### Validation

After the inference is complete, there is a validation step. This ensures the output of the LLM
is in the correct format and helps prevent hallucinations and data validation errors. Smaller or
locally hosted models are more likely to have validation errors than larger flagship models.
Invalid threats and mitigations will not be applied.

![Validation]({{ '/assets/images/ai-tools-validation.png' | relative_url }}){: width="400" }

### Token usage and cost estimation

Token usage and cost estimates are calculated by [litellm](https://docs.litellm.ai/docs/completion/token_usage)
and shown during the validation step. These are best-effort estimates, and you are responsible for
monitoring your own usage limits and costs.

### Logging

The AI tools plugin logs to the default configuration directory for Threat Dragon. For example,
on Windows, it will likely live in `%APPDATA%\Programs\Threat Dragon\logs`, or on Unix-based
systems `~/.config/Threat Dragon/logs/`.

`main.log` logs the main entrypoint of the AI tools plugin.

`threat_modeling_<datetime>.log` logs the integration and processing with the LLM.

`validation_log_memory_<datetime>.log` only logs when DEBUG logging is enabled in AI tools settings,
and contains detailed output for the validation step.

### Electron `safeStorage` implementation and Linux quirks

Please see [Electron's documentation](https://www.electronjs.org/docs/latest/api/safe-storage)
for specific implementation details on how `safeStorage` works under the hood.

**Some Linux users will need to take additional steps for this integration to work properly.**

#### Display managers

Electron expects the display manager to provide a secret store implementation. If you are using a
standard/default configuration for most of the popular Linux distros **and not installing via snap**,
this should usually work out of the box. However, if you are using a non-default display manager
or a more minimal distro, you will likely need some additional configuration.

Electron currently supports the following secret store implementations: kwallet, kwallet5,
kwallet6 and gnome-libsecret

Even if you have one of these secret stores installed on your system, your display manager may not
tell Electron about it. If Electron is unable to find a supported secret store, it will fall back
to `basic_text`.  The `basic_text` implementation will save plaintext files, and is not protected by
encryption. Because of this, the `basic_text` implementation is disallowed in code. When the plugin
cannot find an appropriate secret store implementation, it will show a warning with guidance on how to fix this.

![Invalid Secret Store]({{ '/assets/images/ai-tools-invalid-secret-store.png' | relative_url }}){: width="400" }

If you have a supported secret store, you can tell Electron which implementation to use by launching
Threat Dragon with the `--password-store=` command line argument:

```shell
# Depending on how you installed, it may be threat-dragon or threat-dragon-ng
# You can pass any of the supported secret stores, so long as you have it installed
threat-dragon --password-store=gnome-libsecret
```

#### Snap connectors

If you installed Threat Dragon through Snap, you will need to connect the `password-manager-service`
[interface](https://snapcraft.io/docs/password-manager-service-interface). Snap intentionally does not
allow this permission to auto-connect due to security concerns. To connect Threat Dragon to the interface,
run the following command:

```shell
sudo snap connect threat-dragon-ng:password-manager-service
```

You should only need to do this once, and it should persist across upgrades. Once this is done,
if your window manager exposes a supported secret store, the AI tools plugin will now work as expected.
There is a snap specific warning, similar to the unsupported display manager, if snap is detected and the
plugin is unable to find a secret store implementation.

### Local LLMs

Some testing was done with local LLMs. While models larger than 30b parameters shows future promise,
the test results were consistently lower quality than when using larger, flagship/cloud models. At this time,
we recommend proceeding with caution if you want to explore implementation with local LLMs or smaller models.
It is likely that you will get multiple validation errors. Some testing showed that these smaller models did a
poor job reasoning about trust boundaries, data flow directions, and how different components interact,
leading to fewer identified threats and inaccurate threats and mitigations.

Please see:

- [InfosecOTB's research](https://infosecotb.com/ai-powered-threat-modeling-with-owasp-threat-dragon-part-2-generating-threats-with-artificial-intelligence/)
- [AI Tools Plugin Pull Request](https://github.com/OWASP/threat-dragon/pull/1404/#issuecomment-3764172456)

----

Threat Dragon: _making threat modeling less threatening_

[electron_safestorage]: https://www.electronjs.org/docs/latest/api/safe-storage

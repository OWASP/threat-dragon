---
layout: page
title: AI Tool
nav_order: 0
path: /usage/ai-tool
group: Integrations
---

## Threat Dragon AI Tool

A desktop application that automatically generates STRIDE threats and mitigations for OWASP Threat Dragon
models using LLMs, then adds them to the model’s `.json` file.

![Threat Dragon AI Tool]({{ '/assets/images/td-ai-tool.png' | relative_url }}){: .float-right style="width: 40%;" }

### Quick Start

1. Download the latest version of the application for your operating system from the
   [InfoSecOTB Threat Dragon AI Tool releases](https://github.com/InfosecOTB/threat-dragon-ai-tool/releases)
   page.
2. Move the downloaded compressed file to a folder of your choice and extract it.
3. Run the `td-ai-tool` executable.
4. Configure the settings:
   - **Required**
     - **API Key** - API key for accessing the LLM service.
     - **LLM Model** - LLM model identifier, for example `openai/gpt-5`,
       `anthropic/claude-sonnet-4-5`, or `xai/grok-4`.
     - **Response Format** - Enables structured JSON output. Should be enabled for supported models
       such as `openai/gpt-5` or `xai/grok-4`. If it is enabled for an unsupported model, or disabled
       for a supported model, the request may fail.
   - **Optional** (defaults are usually fine)
     - **Temperature** - Lower values make output more deterministic; higher values increase creativity
       and randomness. Valid range: `0` to `2`.
     - **API Base URL** - Custom API base URL. Most hosted AI providers do not require this because
       LiteLLM handles it automatically.
     - **Log Level** - Logging level: `INFO` or `DEBUG`.
     - **Timeout** - Request timeout in seconds for LLM API calls. Default: `900` seconds (`15 minutes`).
5. Click **Save Config** to persist the settings.
   - Non-secret settings are saved to `config.json` in the same folder as the executable.
   - The API key is saved separately in the OS secure credential store (via `keyring`) and is not
     written to `config.json`.
6. Click **Open Model** (or **File → Open Model**) and select a Threat Dragon `.json` file.
7. Click **Generate Threats and Mitigations**. A warning dialog will appear - read it, then confirm.
8. Wait while the tool processes the model. The console on the right shows progress. Depending on
   the model size and LLM provider, this can take from a few seconds to several minutes.
9. When complete, the tool writes threats directly into your `.json` file and runs a validation
   pass. Open the file in Threat Dragon to see the results.

### Resources

You can find more information about the Threat Dragon AI Tool in the following
locations:

1. [GitHub Repository](https://github.com/InfosecOTB/threat-dragon-ai-tool)
2. Articles on InfoSecOTB blog:
   <!-- markdownlint-disable-next-line MD013 -->
   - [AI-Powered Threat Modelling with OWASP Threat Dragon – Part 1: Creating a Data Flow Diagram](https://infosecotb.com/using-owasp-threat-dragon-and-artificial-intelligence-ai-for-threat-modelling-part-1-creating-a-data-flow-diagram/)
   <!-- markdownlint-disable-next-line MD013 -->
   - [AI-Powered Threat Modelling with OWASP Threat Dragon – Part 2: Generating Threats with Artificial Intelligence](https://infosecotb.com/ai-powered-threat-modeling-with-owasp-threat-dragon-part-2-generating-threats-with-artificial-intelligence/)
   <!-- markdownlint-disable-next-line MD013 -->
   - [AI-Powered Threat Modelling with OWASP Threat Dragon – Part 3: Threat Dragon AI Tool](https://infosecotb.com/ai-powered-threat-modelling-with-owasp-threat-dragon-part-3-threat-dragon-ai-tool/)

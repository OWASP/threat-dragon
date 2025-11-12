# AI Tools Integration with Threat Dragon

This document provides a comprehensive explanation of how the Python AI tools integrate with Threat Dragon to enable AI-powered threat generation using Large Language Models (LLMs).

## Overview

The AI tools module is a Python-based service that generates security threats for Threat Dragon threat models using LLM APIs. The integration allows Threat Dragon users to automatically analyze their threat models and generate comprehensive threat lists based on the STRIDE framework, leveraging advanced language models to identify potential security vulnerabilities.

The integration follows a client-server architecture where Threat Dragon (the Electron desktop application) acts as the client, invoking the Python service as a subprocess and communicating through standard input/output streams.

## First Steps

Before using the AI threat generation feature, the following must be configured in Settings window:

1. **AI Settings and API Key**: Configure your AI settings through Threat Dragon's AI Settings interface. This includes:
   - API Key: An API key for your chosen LLM provider
   - LLM model name (e.g., "gpt-4", "claude-3-opus")
   - Temperature setting
   - Response format preferences
   - API base URL (if using a custom endpoint)
   - Log level preference

**Note on Python Requirements**: 
- **Developer Mode**: If you are running Threat Dragon from source code in development mode, Python 3.8 or higher must be installed. All Python dependencies (including `LiteLLM`) are installed with `npm install`, and the Python virtual environment with all dependencies is automatically bundled when building the desktop application with `npm run build:desktop`.
- **Compiled/Release Builds**: For end users running the compiled Threat Dragon installer, Python is not required. The Python virtual environment and all dependencies are bundled within the installer, so the AI tools work out of the box without any additional Python setup.

Without these settings configured, the AI threat generation process will fail with appropriate error messages guiding you to complete the setup.

## Architecture

### Components

The integration consists of several key components:

**Threat Dragon Side (Electron/Node.js):**
- Menu handler (`menu.js`) - Orchestrates the threat generation workflow
- UI components - Progress dialogs, warning dialogs, and results windows
- IPC communication - Bridges between main process and renderer process

### Folder Structure

The `ai-tools` folder is located within the Threat Dragon project structure:

```
threat-dragon/
└── td.vue/
    ├── ai-tools/                    # AI threat generation tools
    │   ├── src/
    │   │   ├── main.py              # Entry point, orchestrates threat generation
    │   │   ├── ai_client.py         # LLM API communication via LiteLLM
    │   │   ├── utils.py             # Threat model updates and manipulation
    │   │   ├── validator.py         # Response validation and quality checks
    │   │   └── models.py             # Pydantic data models for structured responses
    │   ├── logs/                     # Log files (created at runtime)
    │   ├── prompt.txt               # System prompt template for LLM
    │   ├── requirements.txt         # Python dependencies
    │   └── README.md               # This file
    ├── src/
    │   └── desktop/
    │       └── menu.js              # Threat Dragon menu handler (invokes ai-tools)
    └── ...
```

## Data Flow

### Initialization Phase

1. User initiates threat generation from Threat Dragon's menu
2. Threat Dragon validates that a threat model is open
3. A warning dialog is displayed to inform users about AI-generated content
4. Upon confirmation, the process begins

### Process Invocation

1. Threat Dragon locates Python executable and `main.py` script
2. API key retrieved from system credential manager via `keytar`
3. Threat model schema JSON loaded from Threat Dragon's resources
4. AI settings loaded from `ai-settings.json` (excluding API key)
5. Python subprocess spawned with `--settings-json` and `--logs-folder` arguments

### Processing Phase

The Python script performs the following steps:

1. **Configuration Loading**: Reads AI settings from the JSON file, including:
   - LLM model name
   - Temperature setting (0-2 range)
   - Response format flag (enables JSON schema validation)
   - API base URL (for custom endpoints)
   - Log level (INFO or DEBUG)

2. **Logging Setup**: Configures dual logging:
   - Console handler: Always enabled for INFO+ messages to stderr
   - File handler: Only enabled in DEBUG mode, writes to timestamped log files

3. **Data Reception**: Reads API key, threat model, and schema from stdin

4. **Threat Generation**: 
   - Loads the prompt template from `prompt.txt`
   - Injects the schema and model JSON into the prompt
   - Constructs a system message with the formatted prompt
   - Calls the LLM API using LiteLLM with configured parameters
   - Parses the JSON response using Pydantic models

5. **Response Processing**:
   - Validates the response structure against Pydantic models
   - Handles fallback parsing if JSON is wrapped in markdown
   - Extracts cost information from the API response
   - Converts Pydantic models to dictionaries

6. **Threat Model Update**:
   - Iterates through all diagrams and cells in the model
   - Matches generated threats to elements by cell ID
   - Adds unique UUIDs to threats that lack them
   - Updates the `hasOpenThreats` flag based on threat status
   - Adds visual indicators (red stroke) to cells with threats
   - Skips out-of-scope elements and trust boundaries

7. **Validation**: Validates threat quality, element coverage, and calculates statistics (see Validation section)

### Response Transmission

The Python script outputs data to standard output using marker-based delimiters:

- `<<JSON_START>>` / `<<JSON_END>>` - Encloses the updated threat model JSON
- `<<METADATA_START>>` / `<<METADATA_END>>` - Encloses metadata (cost, validation results)

Threat Dragon extracts the JSON and metadata, sends the updated model to the renderer via IPC, and displays results. Log messages are written to stderr to avoid interfering with structured output.

## Communication Protocol Details

### Input Format

Data is transmitted via stdin as UTF-8 encoded, newline-delimited text:
1. First line: API key (never logged)
2. Second line: Complete threat model JSON (single line, no pretty-printing)
3. Third line: Threat model schema JSON (single line, no pretty-printing)

### Output Format

The stdout protocol uses marker-based delimiters to separate structured data from log messages. This allows Threat Dragon to reliably extract the updated threat model and metadata while Python can write log messages to stderr.

## Security Considerations

### API Key Management

The API key is stored securely in the system credential manager using the `keytar` library (Windows Credential Manager, macOS Keychain, or Linux Secret Service), separate from other settings. It is retrieved by Threat Dragon's Node.js process before invoking Python, transmitted only through stdin (never as command-line arguments), and never logged or written to files. The Python tools do not access the credential manager directly.

## Configuration

AI settings must be configured through Threat Dragon's AI Settings interface before generating threats. The settings (excluding the API key) are stored in `ai-settings.json` in Threat Dragon's user data directory:

```json
{
  "llmModel": "gpt-4",
  "temperature": 0.1,
  "responseFormat": true,
  "apiBase": "",
  "logLevel": "INFO"
}
```

- `llmModel`: LLM model identifier (e.g., "gpt-4", "claude-3-opus")
- `temperature`: Randomness control (0.0 = deterministic, 2.0 = very random)
- `responseFormat`: Enables JSON schema validation when true
- `apiBase`: Custom API endpoint URL (empty for default providers)
- `logLevel`: "INFO" for console output, "DEBUG" for detailed file logs

The API key is stored separately in the system credential manager (see Security Considerations).

## Threat Generation Process

### STRIDE Framework

The AI tools use the STRIDE threat modeling framework:


### Element Analysis

The system analyzes threat model elements based on:

- **Shape**: Determines element type (actor, process, store, flow)
- **Position and Size**: Infers adjacency, containment, and trust boundary crossings
- **Connections**: Analyzes data flows and their directions
- **Properties**: Considers encryption, public networks, protocols, and bidirectional flows
- **Trust Boundaries**: Identifies security zones and boundary crossings

### Threat Attributes

Each generated threat includes:

- **Title**: Short descriptive name
- **Status**: "Open", "Mitigated", or "NA"
- **Severity**: "High", "Medium", or "Low" (based on exposure and exploitability)
- **Type**: One of the six STRIDE categories
- **Description**: Detailed explanation referencing element names and layout facts
- **Mitigation**: Specific recommendations for addressing the threat
- **Model Type**: Always "STRIDE" for this implementation

## Validation and Quality Assurance

### Validation Process

The `ThreatValidator` class performs comprehensive validation:

1. **Element Coverage**: Checks that all in-scope elements received threats
2. **ID Validation**: Verifies that threat IDs match actual model elements
3. **Scope Validation**: Identifies threats assigned to out-of-scope elements
4. **Quality Checks**: Detects empty mitigations and other quality issues
5. **Statistics Calculation**: Computes coverage percentages and threat counts

### Validation Results

Validation produces:

- **Overall Status**: Valid or invalid (based on ID overlap)
- **Statistics**: Coverage, threat counts, element counts
- **Warnings**: Quality issues and scope violations
- **Info Messages**: Missing elements (informational, not errors)

### Logging

Two logging modes are supported:

- **INFO Mode**: Console output only, minimal logging
- **DEBUG Mode**: Detailed file logs with timestamps, includes:
  - Configuration details
  - Threat generation progress
  - Individual threat details
  - Validation results
  - Full AI responses

Log files are stored in the logs directory with timestamped filenames.

## Error Handling

Errors are handled at multiple levels: process-level errors (missing Python, script, or API key) display error dialogs; runtime errors (JSON parsing, LLM API failures) are caught and reported with context; validation errors are included in metadata but don't stop the process; encoding errors are handled automatically with UTF-8 fallbacks. Users can cancel the process, which terminates the Python subprocess and cleans up resources.

## Integration Points

Threat Dragon locates files via helper functions (`getAISettingsPath()`, `getPythonExecutable()`), resolves paths for development vs production builds, and uses Electron's `app.getPath('logs')` for log storage. The Python subprocess runs with UTF-8 encoding and working directory set to the script location. IPC communication uses `ai-threat-generation-request` and `ai-threat-generation-complete` events between main and renderer processes.

## Dependencies

All Python dependencies are installed with `npm install` and automatically bundled when building the desktop application with `npm run build:desktop`.

### Python Dependencies

- `litellm`: Unified interface for multiple LLM providers
- `pydantic`: Data validation and parsing

### Node.js Dependencies

- `child_process`, `fs`, `path`: Standard Node.js modules for process and file management
- `keytar`: Secure credential storage in system credential manager
- Electron APIs: `app`, `BrowserWindow`, `dialog`, `ipcMain`

## Usage Workflow

User opens a threat model, selects "Generate Threats with AI" from the menu, confirms the warning dialog, and monitors progress. The Python process generates threats, and results are displayed with cost and validation statistics. The threat model is automatically updated, and users can review and edit the generated threats.


## Technical Notes

### Compatibility

- Cross-platform: Windows, macOS, Linux
- Python 3.8+ required only for development mode (compiled builds include Python venv)
- Works with most LLM providers through the LiteLLM library

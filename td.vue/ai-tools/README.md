## AI Tools – Integration with Threat Dragon

This document explains **how the Python AI tools integrate with Threat Dragon** and **how the end‑to‑end AI threat generation flow works** (architecture, data flow, configuration, and runtime behavior).

---

## High‑Level Overview

The `ai-tools` module is a **Python service** that generates STRIDE‑based security threats for Threat Dragon models using **LLM APIs via LiteLLM**.

- **Threat Dragon desktop app (Electron + Vue)**:
  - Hosts the user interface, AI settings screens, progress/warning/results dialogs, and threat model editor.
  - Orchestrates the AI workflow and owns the model data and schema.
- **AI tools (Python, this folder)**:
  - Run as a **subprocess** of the Electron main process.
  - Read the API key, model JSON, and schema JSON from **stdin**.
  - Call the configured LLM, generate threats, update the model in memory, validate coverage/quality, and return results over **stdout**.

End users only ever interact with Threat Dragon; the Python tools are an internal implementation detail.

---

## Folder Structure

```text
td.vue/
└─ ai-tools/                     # Python AI threat generation tooling, bundled with the desktop app
   ├─ src/
   │  ├─ main.py                 # Entry point: args + logging + stdin, orchestrates generation and validation
   │  ├─ ai_client.py            # LiteLLM client, prompt handling, and response parsing
   │  ├─ utils.py                # Updates the in‑memory Threat Dragon model and visual indicators
   │  ├─ validator.py            # Validates AI output and computes coverage/quality statistics
   │  └─ models.py               # Pydantic models describing the AI response format
   ├─ prompt.txt                 # STRIDE‑focused system prompt template
   └─ requirements.txt           # Python dependencies (LiteLLM, Pydantic)
```

On the Threat Dragon side, the main integration points are:

```text
td.vue/
├─ src/
│  ├─ desktop/
│  │  ├─ menu.js                 # Desktop menu handlers and Python subprocess orchestration
│  │  └─ desktop.js              # Bridges Electron IPC events to the menu handlers
│  └─ main.desktop.js            # Renderer integration: sends model data, receives updated models
├─ public/
│  └─ ai-*.html                  # AI warning, progress, and results windows
├─ scripts/
│  └─ setup-venv.js              # Creates Python venv and installs ai-tools/requirements.txt on npm install
└─ vue.config.js                 # Copies ai-tools and the Python venv into the Electron build
```

---

## Integration Architecture

### Desktop App ↔ Python Subprocess

- **Trigger**:
  - User selects **“Generate Threats & Mitigations”** from the Threat Dragon desktop menu.
  - `menu.js` (`generateThreatsAndMitigations`) opens a warning dialog; on confirmation it calls `proceedWithThreatGeneration`.
- **Requesting model data**:
  - `proceedWithThreatGeneration` checks that a model is open and then sends the IPC event **`ai-threat-generation-request`** to the renderer.
  - In `main.desktop.js`, `window.electronAPI.onAIThreatGenerationRequest`:
    - Verifies the current view (diagram/report/edit views are disallowed).
    - Calls `tmActions.diagramApplied` to ensure the latest diagram state is reflected.
    - Reads `app.$store.state.threatmodel.data` and calls `window.electronAPI.aiThreatGeneration(modelData)`.
- **Desktop main process**:
  - `desktop.js` receives the renderer event and forwards it to `menu.aiThreatGeneration(modelData)`.
  - `menu.aiThreatGeneration` invokes `runPythonThreatGeneration(modelData)` which:
    - Resolves the **Python executable** in the bundled venv via `getPythonExecutable()`.
    - Resolves `ai-tools/src/main.py` via `getMainPyPath()`.
    - Loads the **AI settings JSON** path via `getAISettingsPath()`.
    - Loads the **Threat Dragon v2 schema JSON** from `src/assets/schema/threat-dragon-v2.schema.json`.
    - Retrieves the **API key** from secure storage via `loadAPIKey()` (using Electron's `safeStorage` API).
    - Spawns the Python process using `spawn(pythonExecutable, [mainPyPath, '--settings-json', aiSettingsPath, '--logs-folder', app.getPath('logs')])`.
    - Opens the **AI Threats Progress** dialog.
- **Data exchange with Python (stdin / stdout / stderr)**:
  - **stdin (UTF‑8, newline‑delimited)**:
    1. First line – API key (never logged by Python).
    2. Second line – Threat model JSON (single‑line stringified).
    3. Third line – Threat model schema JSON (single‑line stringified).
  - **stdout (structured payloads)**:
    - `<<JSON_START>> ... <<JSON_END>>` – Updated threat model JSON.
    - `<<METADATA_START>> ... <<METADATA_END>>` – Metadata JSON (LLM cost, validation results).
  - **stderr (logs)**:
    - All diagnostic/logging output goes to stderr to avoid corrupting the structured stdout markers.
- **Result handling**:
  - `menu.js` collects all stdout/stderr, handles non‑zero exit codes, and parses the model JSON and metadata.
  - On success it:
    - Sends **`ai-threat-generation-complete`** with the updated model to the renderer.
    - Closes the progress dialog.
    - Opens the **AI Threats Results** window, passing cost and validation stats.

### Renderer‑Side Integration

- `main.desktop.js` listens for **`onAIThreatGenerationComplete`** and updates the Vuex store with the updated model, ensuring the UI reflects newly attached threats and visual indicators.
- The renderer is responsible for:
  - Showing toast messages if the user attempts generation from unsupported views.
  - Persisting changes using the existing Threat Dragon save flows.

---

## Python Components and Responsibilities

- **`main.py`**
  - Parses CLI arguments: `--settings-json` and `--logs-folder`.
  - Ensures stdout/stderr use UTF‑8 (important on Windows).
  - Loads AI settings JSON (model, temperature, response format flag, API base, log level).
  - Configures logging (console always; additional file logging when `logLevel=DEBUG`).
  - Reads API key, model JSON, and schema JSON from stdin.
  - Calls `ai_client.generate_threats(...)` to obtain threats + cost.
  - Calls `update_threats_in_memory(...)` to inject threats into the threat model and apply visual markers.
  - Runs `ThreatValidator` to measure coverage and quality; prints a summary and provides structured validation metadata.
  - Writes:
    - Updated model JSON between `<<JSON_START>>` / `<<JSON_END>>`.
    - Metadata JSON (cost + validation stats) between `<<METADATA_START>>` / `<<METADATA_END>>`.

- **`ai_client.py`**
  - Reads `prompt.txt` and injects:
    - `schema_json` – the full Threat Dragon v2 schema.
    - `model_json` – the full threat model (may contain multiple diagrams).
  - Constructs a **STRIDE‑focused system prompt** plus a brief user message requesting threats and mitigations.
  - Configures LiteLLM:
    - Enables optional JSON schema validation when `responseFormat` is `true`.
    - Computes `max_tokens` based on the selected model (with a safe fallback).
    - Supports optional custom `api_base` endpoints.
  - Calls `litellm.completion`, tracks `response_cost`, and parses the response:
    - First attempts strict JSON parsing into `AIThreatsResponseList`.
    - Falls back to extracting an embedded JSON block when the model returns markdown or additional text.
  - Returns a dictionary mapping **cell IDs → arrays of threat objects**, plus `response_cost`.

- **`models.py`**
  - Defines Pydantic models for the expected AI response:
    - `Threats` – individual threat (title, status, severity, type, description, mitigation, `modelType`).
    - `AIThreatsResponse` – threats for a single element (`id`, `threats`).
    - `AIThreatsResponseList` – top‑level response (`items: List[AIThreatsResponse]`).
  - Enforces:
    - `status` ∈ `{NA, Open, Mitigated}`.
    - `severity` ∈ `{High, Medium, Low}`.
    - `modelType` ∈ `{STRIDE, LINDDUN, CIA, DIEF, RANSOM, PLOT4ai, Generic}` (the STRIDE‑focused prompt currently uses `"STRIDE"`).

- **`utils.py`**
  - Iterates over all diagrams and cells in `model.detail.diagrams[]`.
  - Matches threats by **cell `id`** and:
    - Skips out‑of‑scope elements (`data.outOfScope=true`) and trust boundaries (`trust-boundary-box`, `trust-boundary-curve`).
    - Ensures each threat has a unique `id` (UUID) if one is missing.
    - Assigns threats to `cell.data.threats`.
    - Updates `cell.data.hasOpenThreats` when present.
    - Calls `_add_red_stroke` to visually mark elements with threats in the diagram view.

- **`validator.py`**
  - Computes the set of **in‑scope elements** (not out‑of‑scope, not trust boundaries) and the set of all model element IDs.
  - Compares AI response IDs to:
    - Detect missing in‑scope elements.
    - Detect threats attached to out‑of‑scope/unknown elements.
    - Detect completely unrelated responses (no ID overlap with the model).
  - Performs quality checks (e.g. empty mitigations) and calculates statistics:
    - Number of in‑scope elements.
    - Number of elements with threats.
    - Total threats generated.
    - Coverage percentage.
  - In `DEBUG` mode writes detailed logs into `logs/validation_log_*.log`, and always prints a concise summary to stdout.

---

## Configuration and Security

- **AI settings (excluding API key)**:
  - Managed through Threat Dragon’s **AI Settings** UI.
  - Persisted as `ai-settings.json` under the app’s user data directory.
  - Example structure:

```json
{
  "llmModel": "openai/gpt-5",
  "temperature": 0.1,
  "responseFormat": true,
  "apiBase": "",
  "logLevel": "INFO"
}
```

- **API key handling**:
  - Stored securely using **Electron's `safeStorage` API** (uses OS-level encryption: DPAPI on Windows, Keychain on macOS, Secret Service on Linux).
  - Retrieved by the **Node/Electron main process** only.
  - Passed to Python **via stdin only**, never as a command‑line argument and never written to logs or files.
  - The Python tools do not interact with the credential manager directly.

- **Logging**:
  - Console logging (INFO level) is always enabled and written to **stderr**.
  - When `logLevel` is `DEBUG`, Python writes additional detailed logs to the directory provided via `--logs-folder` (Electron uses `app.getPath('logs')`).

---

## Development vs Packaged Builds

- **Development mode (`npm run start:desktop`)**:
  - Requires **Python 3.8+** installed on the developer machine.
  - `npm install` runs `scripts/setup-venv.js`, which:
    - Creates a local `venv` in the `td.vue` project directory.
    - Installs dependencies from `ai-tools/requirements.txt` into that venv.
  - `menu.js` resolves both the venv and `ai-tools/src/main.py` relative to the `td.vue` source tree.

- **Packaged/installer builds (`npm run build:desktop`)**:
  - The Electron build process (see `vue.config.js`) copies:
    - The **`ai-tools`** folder.
    - The pre‑created **Python `venv`**.
  - `menu.js` resolves both the Python interpreter and `main.py` from `process.resourcesPath`.
  - **End users do not need Python installed**; the installer ships a self‑contained venv and AI tools bundle.

---

## End‑User Workflow in Threat Dragon

- **Prerequisites**:
  - Configure AI settings in **AI Settings** (model, temperature, response format, optional API base, log level).
  - Provide and save a valid API key (stored securely via Electron's `safeStorage`).

- **Generating threats with AI**:
  - Open a Threat Dragon model and ensure diagrams are saved/closed.
  - From the desktop menu, choose **“Generate Threats & Mitigations”**.
  - Review and acknowledge the AI warning dialog.
  - Watch the **AI Threats Progress** dialog while the Python tools run.
  - When complete, the editor is updated with:
    - New or adjusted threats on in‑scope elements.
    - Visual red strokes on elements with threats.
  - The **AI Threats Results** window displays:
    - LLM cost.
    - Coverage and threat statistics.
    - Validation warnings and informational notes.

At this point, users can review, edit, and save the AI‑generated threats as part of their normal Threat Dragon workflow.



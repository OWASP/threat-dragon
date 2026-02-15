---
layout: page
title: Schema
nav_order: 5
path: /development/schema
group: Development
---

## Threat Model Schema

The [original schema][td-v1-schema] for Threat Dragon models conforms to [JSON Schema][json-schema] standard.

There were some changes, mainly in the diagram component properties for version 2 Threat Dragon threat models,
and so there is a [different schema][td-v2-schema] for these threat models - also conforming to JSON Schema.

Threat Dragon will check a threat model against the schema when it is loading and warn if there is a problem,
but it will not stop the threat model from loading.

If there is doubt about a threat model then ajv (Another JSON Validator) can be run from the
command line to provide detail for most errors or omissions.
Ensure you have `npm` installed first, for example `brew install npm` if you are using MacOS,
and this will also install `npx` which is bundled with `npm`.

Install `ajv` using `npm` and then run `ajv` for the model using `npx`:

```text
sudo npm install -g ajv-cli
# if validating a version 1.x threat model
npx ajv validate -s ~/threat-dragon-v1.schema.json  --all-errors  --verbose \
    -d ThreatDragonModels/demo-threat-model.json
# or if validating a version 2.x threat model
npx ajv validate --allow-union-types -s ~/threat-dragon-v2.schema.json  --all-errors  --verbose \
    -d ThreatDragonModels/v2-threat-model.json
```

## Template Schema

Threat Dragon templates use a specific format that combines threat model content with template metadata.
Templates consist of two parts:

### Template Metadata

The template metadata contains information for browsing and managing templates:

```json
{
  "id": "uuid-v4-string",
  "modelRef": "uuid-v4-string", 
  "name": "Template Display Name",
  "description": "Brief description of the template purpose",
  "tags": ["web", "api", "microservices"]
}
```

### Template Content

The template content is a complete threat model that follows the
[Version 2.x schema]({{ '/assets/schemas/owasp.threat-dragon.schema.V2.json' | relative_url }}).

### Template File Format

When imported or exported locally, templates combine both parts:

```json
{
  "templateMetadata": {
    "id": "uuid-v4-string",
    "modelRef": "uuid-v4-string",
    "name": "Web Application Template",
    "description": "Basic template for web applications",
    "tags": ["web", "basic"]
  },
  "model": {
    "summary": {
      "title": "Template Title",
      "owner": "Template Owner"
    },
    "detail": {
      "contributors": [],
      "diagrams": []
    }
  }
}
```

### Template Storage and the ModelRef Relationship

When templates are stored in the organization's template repository (configured via `GITHUB_CONTENT_REPO`),
the metadata and content are stored separately for efficient indexing and retrieval.

**Field definitions:**

| Field | Purpose |
| ----- | ------- |
| `id` | Unique identifier for the template metadata record itself |
| `modelRef` | Reference UUID that links the metadata to its corresponding template content file |

**Repository structure:**

```text
templates/
├── template_info.json          # Index file containing all template metadata
├── a1b2c3d4-e5f6-7890-abcd-ef1234567890.json   # Template content file
├── b2c3d4e5-f6a7-8901-bcde-f12345678901.json   # Another template content
└── ...
```

**How it works:**

1. `template_info.json` contains an object with a `templates` array of metadata objects
   (id, modelRef, name, description, tags)
2. Each metadata object's `modelRef` value corresponds to a content file named
   `{modelRef}.json`
3. When listing templates, only `template_info.json` is fetched (lightweight operation)
4. When a user selects a template, the full content is fetched using the `modelRef` to
   locate the file

**Example `template_info.json`:**

```json
{
  "templates": [
    {
      "id": "meta-uuid-1",
      "modelRef": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "name": "Web Application Template",
      "description": "Basic web app architecture",
      "tags": ["web", "basic"]
    },
    {
      "id": "meta-uuid-2",
      "modelRef": "b2c3d4e5-f6a7-8901-bcde-f12345678901",
      "name": "Microservices Template",
      "description": "Distributed microservices pattern",
      "tags": ["microservices", "api"]
    }
  ]
}
```

The corresponding content file `a1b2c3d4-e5f6-7890-abcd-ef1234567890.json` contains the full threat model
that will be used as the starting point when creating a new model from this template.

### TM-BOM

The schema for the Threat Modeling - Bill of Materials (TM-BOM) file format is being developed as part of the
OWASP [Threat Model Library project][tm-library].
The long term plan for Threat Dragon is to adopt this as the primary file format
for both read/import and write/export of threat model files.

The [TM-BOM schema][tm-library-schema] defines various object that make up a TM-BOM threat model :

* A **Mitigation Plan** is created and
  * contains an array of Controls
  * is applied to a specific Risk
* A **Risk** is identified and
  * is applied to an array of Threats
* A **Control** is identified and
  * is applied as mitigation to an array of Threats
  * optionally contains a Trust Boundary that it protects
* A **Trust Boundary** is identified for Controls applied between Trust Zones and
  * contains a first Trust Zone
  * contains a second Trust Zone
* A **Trust Zone** is identified from changes in trust between nodes (Components / Actors / Data Stores)
* A **Threat** is identified and
  * contains a specific Threat Persona
  * is optionally applied to an array of diagram objects (Components / Actors / Data Stores / Data Flows)
* A **Threat Persona** is identified with defining attributes
* An **Assumption** is made and
  * is optionally applied to an array of general schema objects
* An **Actor** is identified that creates data in transit and
  * (TBC) is optionally assigned to a Trust Zone
* A **Component** (process) is identified that creates data in transit and
  * is assigned to a Trust Zone
  * is optionally applied to a parent Component, to allow nested components
* A **Data Store** is identified that stores data at rest and
  * (TBC) is assigned to a Trust Zone
* A **Data Set** is defined and
  * is applied to an array of Data Stores
* A **Data Flow** is identified and
  * is applied to a source node (Component / Actor / Data Store)
  * is applied to a destination node (Component / Actor / Data Store)
* A **Diagram** is created and used to illustrate the threat model

### References

* [Version 1 Threat Dragon][td-v1-schema] schema
* [Version 2 Threat Dragon][td-v2-schema] schema
* [Threat Model Bill of Materials][tm-library-schema] (TM-BOM) schema
* [Open Threat Model][otm-schema] schema

----

Threat Dragon: _making threat modeling less threatening_

[json-schema]: https://json-schema.org/
[otm-schema]: https://github.com/iriusrisk/OpenThreatModel/blob/main/otm_schema.json
[td-v1-schema]: https://github.com/OWASP/threat-dragon/tree/main/td.vue/src/assets/schema/threat-dragon-v1.schema.json
[td-v2-schema]: https://github.com/OWASP/threat-dragon/tree/main/td.vue/src/assets/schema/threat-dragon-v2.schema.json
[tm-library]: https://github.com/OWASP/www-project-threat-model-library
[tm-library-schema]: https://github.com/OWASP/www-project-threat-model-library/tree/main/threat-model.schema.json

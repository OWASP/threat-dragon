---
layout: page
title: Schema
nav_order: 5
path: /development/schema
group: Development
---

## Threat Model Schema

The original [version 1.x schema]({{ '/assets/schemas/owasp.threat-dragon.schema.V1.json' | relative_url }})
for Threat Dragon models conforms to [JSON Schema](https://json-schema.org/).

There were some changes, mainly in the diagram component properties for version 2 Threat Dragon
threat models, and so there is a
[different schema]({{ '/assets/schemas/owasp.threat-dragon.schema.V2.json' | relative_url }})
for these threat models - also conforming to JSON Schema.

Threat Dragon will check a threat model against the schema when it is loading and warn if there is a problem,
but it will not stop the threat model from loading.

If there is doubt about a threat model then ajv (Another JSON Validator) can be run from the
command line to provide details of any discrepancy:

```text
sudo npm install -g ajv-cli
# if validating a version 1.x threat model
ajv validate -s ~/owasp.threat-dragon.schema.V1.json  --all-errors  --verbose \
    -d ThreatDragonModels/demo-threat-model.json
# or if validating a version 2.x threat model
ajv validate --allow-union-types -s ~/owasp.threat-dragon.schema.V2.json  --all-errors  --verbose \
    -d ThreatDragonModels/v2-threat-model.json
```

### TM-BOM

The schema for the Threat Modeling - Bill of Materials (TM-BOM) file format is being developed as part of the
OWASP [Threat Model Library project][tm-library].
The long term plan for Threat Dragon is to adopt this as the primary file format
for both read/import and write/export of threat model files.

The [TM-BOM schema][tm-library-schema] defines various object that make up a TM-BOM threat model :

* A **Mitigation Plan** is created and
  * contains a set of Controls
  * is applied to a specific Risk
* A **Risk** is identified and
  * is applied to a set of Threats
* A **Control** is identified and
  * is applied as mitigation to a set of Threats
  * optionally contains a Trust Boundary that it protects
* A **Trust Boundary** is identified for Controls applied between Trust Zones and
  * contains a first Trust Zone
  * contains a second Trust Zone
* A **Trust Zone** is identified from changes in trust between nodes (Components / Actors / Data Stores)
* A **Threat** is identified and
  * contains a specific Threat Persona
  * is optionally applied to a set of diagram objects (Components / Actors / Data Stores / Data Flows)
* A **Threat Persona** is identified with defining attributes
* An **Assumption** is made and
  * is optionally applied to a set of general schema objects
* An **Actor** is identified that creates data in transit and
  * (TBC) is optionally assigned to a Trust Zone
* A **Component** (process) is identified that creates data in transit and
  * is assigned to a Trust Zone
  * is optionally applied to a parent Component, to allow nested components
* A **Data Store** is identified that stores data at rest and
  * (TBC) is assigned to a Trust Zone
* A **Data Set** is defined and
  * is applied to a set of Data Stores
* A **Data Flow** is identified and
  * is applied to a source node (Component / Actor / Data Store)
  * is applied to a destination node (Component / Actor / Data Store)
* A **Diagram** is created and used to illustrate the threat model

----

Threat Dragon: _making threat modeling less threatening_

[tm-library]: https://github.com/OWASP/www-project-threat-model-library
[tm-library-schema]: https://github.com/OWASP/www-project-threat-model-library/blob/main/threat-model.schema.json

---
layout: page
title: Schema
nav_order: 5
path: /development/schema
group: Development
---

## Threat Model Schema

The original [version 1.x schema]({{ '/assets/schemas/owasp.threat-dragon.schema.V1.json' }})
for Threat Dragon models conforms to [JSON Schema](https://json-schema.org/).

There were some changes, mainly in the diagram component properties for version 2 Threat Dragon
threat models, and so there is a
[different schema]({{ '/assets/schemas/owasp.threat-dragon.schema.V2.json' }})
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

----

Threat Dragon: _making threat modeling less threatening_

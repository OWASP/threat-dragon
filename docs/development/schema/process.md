---
layout: page
title: Process
nav_order: 6
path: /schema/process
group: Schema
---

# Process Schema

{:.table .table-striped}
| Property | Required | Type | Default |
|---|---|---|
| type | yes | `string` | tm.Process |
| name | no | `string` | |
| description | no | `string` | |
| outOfScope | yes | `boolean` | false |
| reasonOutOfScope | no | `string` | |
| privilegeLevel | no | `string` | |
| hasOpenThreats | yes | `boolean` | false |
| threats | no | `object[]` | [] |

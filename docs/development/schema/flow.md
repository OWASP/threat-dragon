---
layout: page
title: Flow
nav_order: 4
path: /schema/flow
group: Schema
---

# Flow

{:.table .table-striped}
| Property | Required | Type | Default |
|---|---|---|
| type | yes | `string` | tm.Flow |
| name | no | `string` | |
| description | no | `string` | |
| outOfScope | yes | `boolean` | false |
| reasonOutOfScope | no | `string` | |
| protocol | yes | `string` | |
| isEncrypted | yes | `boolean` | false |
| isPublicNetwork | yes | `boolean` | false |
| hasOpenThreats | yes | `boolean` | false |
| threats | no | `object[]` | [] |

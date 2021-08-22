---
layout: page
title: Store
nav_order: 2
path: /schema/store
group: Schema
---

# Store

{:.table .table-striped}
| Property | Required | Type | Default |
|---|---|---|
| type | yes | `string` | tm.Store |
| name | no | `string` | |
| description | no | `string` | |
| outOfScope | yes | `boolean` | false |
| reasonOutOfScope | no | `string` | |
| isALog | yes | `boolean` | false |
| storesCredentials | yes | `boolean` | false |
| isEncrypted | yes | `boolean` | false |
| isSigned | yes | `boolean` | false |
| hasOpenThreats | yes | `boolean` | false |
| threats | no | `object[]` | [] |

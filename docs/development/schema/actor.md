---
layout: page
title: Actor
nav_order: 3
path: /schema/actor
group: Schema
---

# Actor

{:.table .table-striped}
| Property | Required | Type | Default |
|---|---|---|
| type | yes | `string` | tm.Actor |
| name | no | `string` | |
| description | no | `string` | |
| outOfScope | yes | `boolean` | false |
| reasonOutOfScope | no | `string` | |
| providesAuthentication | yes | `boolean` | false |
| hasOpenThreats | yes | `boolean` | false |
| threats | no | `object[]` | [] |

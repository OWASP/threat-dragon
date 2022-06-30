---
layout: page
title: Linking
path: /collaboration/linking
nav_order: 0
group: Collaboration
---

# Deep Links
Threat Dragon supports the concept of deep linking.  The deep links have changed from v1 due to
the addition of identity providers. Please take note of the new structure.

## Provider Types
Threat dragon supports multiple provider types.  Each provider "type" can have multiple providers,
but they fall under the same category as far as deep linking is concerned.
More providers and provider types will be added in the future.

Any word with a preceding colon (`:`) is a variable.  Substitute the variables where appropriate.
Variables will need to be URLEncoded.

### Git

{:.table .table-striped}
| Action | Link |
|---|---|
|View Threat Model|`/git/:provider/:repository/:branch/:threatmodel`|
|Edit Threat Model|`/git/:provider/:repository/:branch/:threatmodel/edit`|
|Edit Diagram|`/git/:provider/:repository/:branch/:threatmodel/:diagram/edit` *(not implemented)|

### Local
While you might not be able to collaborate by sharing deep links when using the local session,
this can still be helpful for reference:

{:.table .table-striped}
| Action | Link |
|View Threat Model|`/local/:threatmodel`|
|Edit Threat Model|`/local/:threatmodel/edit`|
|Edit Diagram|`/local/:threatmodel/:diagram/edit` *(not implemented)|

---
layout: page
title: API
nav_order: 2
path: /api
group: API
---

## [OWASP](https://www.owasp.org) Threat Dragon

At present it there is a minimal application programming interface for
[Threat Dragon](http://owasp.org/www-project-threat-dragon) .
This API is used to access to threat models stored by repository providers, github being the first.

APIs protected by authorisation, including threat model CRUD:

{:.table .table-striped}
| Path | Action | Description |
| ---- | ---- | ---- |
| `/api/logout` | POST | Logout from provider when already authorised |
| `/api/token/refresh` | POST | Refresh the access token |
| `/api/threatmodel/repos` | GET | List repositories for the authorised user |
| `/api/threatmodel/:organisation/:repo/branches` | GET | List branches for a given repository |
| `/api/threatmodel/:organisation/:repo/:branch/models` | GET | List models for a given branch and repository |
| `/api/threatmodel/:organisation/:repo/:branch/:model/data` | GET | Reads the threat model contents for a given model |
| `/api/threatmodel/:organisation/:repo/:branch/:model` | DELETE | Delete a model from a given branch and repository |
| `/api/threatmodel/:organisation/:repo/:branch/:model/create` | PUT | Creates a new model in the given branch and repository |
| `/api/threatmodel/:organisation/:repo/:branch/:model/update` | PUT | Update a model in the given branch and repository |


APIs with no authorisation:

{:.table .table-striped}
| Path | Action | Description |
| ---- | ---- | ---- |
| `/` | GET | Provides the Threat Dragon Single Page Application |
| `/healthz` | GET | Health check that provides server statistics such as uptime |
| `/api/login/:provider` | GET | Login to a repository provider, such as github |
| `/api/logout` | GET | Logout that will always succeed |
| `/api/oauth/return` | GET | OAuth return request |
| `/api/oauth/:provider` | GET | Provides access and refresh tokens if authorised |

Support for CI/CD pipelines is being worked on, and this API may include:
* project status
* pdf output
* diagram provider
* unmitigated threat list
* mitigated threat list
* statistics

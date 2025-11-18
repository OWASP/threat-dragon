---
layout: page
title: API
nav_order: 3
path: /development/api
group: Development
---

## Application Programming Interface (API)

At present it there is a minimal API for [Threat Dragon](https://owasp.org/www-project-threat-dragon/) .
This API is used to access threat models stored by repository providers such as github, bitbucket or gitlab
and on Google Drives.

APIs protected by authorisation, including threat model Create, Read, Update (but no Delete):

| Path | Action | Description |
| ---- | ---- | ---- |
|      |      |      |
| `/api/logout` | POST | Logout from provider when already authorised |
| `/api/token/refresh` | POST | Refresh the access token |
| `/api/googleproviderthreatmodel/folders` | GET | List folders in the Google Drive |
| `/api/googleproviderthreatmodel/:folder/create` | POST | Create folder in the Google Drive |
| `/api/googleproviderthreatmodel/:file/update` | PUT | Update file in the Google Drive |
| `/api/googleproviderthreatmodel/:file/data` | GET | Read contents of a file in the Google Drive |
| `/api/threatmodel/repos` | GET | List repositories for the authorised user |
| `/api/threatmodel/:organisation/:repo/branches` | GET | List branches for a given repository |
| `/api/threatmodel/:organisation/:repo/:branch/models` | GET | List models for a given branch and repository |
| `/api/threatmodel/:organisation/:repo/:branch/:model/data` | GET | Reads the threat model contents for a given model |
| `/api/threatmodel/:organisation/:repo/:branch/:model/create` | PUT | Create a new model in the branch and repository |
| `/api/threatmodel/:organisation/:repo/:branch/:model/update` | PUT | Update a model in the branch and repository |
| `/api/threatmodel/:organisation/:repo/:branch/createBranch` | POST | Create a new branch in the repository |

APIs with no authorisation:

| Path | Action | Description |
| ---- | ---- | ---- |
| `/` | GET | Provides the Threat Dragon Single Page Application |
| `/healthz` | GET | Health check that provides server statistics such as uptime |
| `/api/login/:provider` | GET | Login to a repository provider|
| `/api/logout` | GET | Logout that will always succeed |
| `/api/oauth/return` | GET | OAuth return request |
| `/api/oauth/:provider` | GET | Provides access and refresh tokens if authorised |
| `/api/config` | GET | Provides the list of configured providers |
| `/api/threatmodel/organization` | GET | Provides repository provider hostname |

### Provider Types

Threat Dragon supports multiple provider types, and supports the concept of deep linking.
Each provider "type" can have multiple providers, and they fall under the same category as far as deep linking is concerned.

Any word with a preceding colon (`:`) is a variable.
Substitute the variables where appropriate, variables need to be URLEncoded.

### CI/CD

Support for CI/CD pipelines is an enhancement for the future, and this API may then include:

* project status
* pdf report output
* threat diagram provider (for embedding in other reports)
* unmitigated threat list
* mitigated threat list
* statistics

----

Threat Dragon: _making threat modeling less threatening_

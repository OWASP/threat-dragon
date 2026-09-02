---
layout: page
title: Analytics and privacy
nav_order: 5
path: /trust/analytics
group: Trust
---

## Analytics

Threat Dragon uses the Plausible server-side Events API. The browser does not load a Plausible script or contact a
Plausible host. It sends an event to its own Threat Dragon server. The server then decides whether it can forward the
event.

***Analytics are disabled by default and require server configuration***.
They are never captured on the desktop app, or in a standalone front-end.

### What is collected

This integration was designed with a privacy-first mindset, while also allowing
maintainers and administrators to understand how Threat Dragon is being used.

The exact events that are collected can be found in the source. Threat Dragon does not
send model data or usernames to Plausible. The analytics answer these questions:

- Which application areas are used?
- Which providers are selected?
- Which languages need translation attention?
- Which methodologies are used?
- How long are editing sessions?
- Is the suggestion engine adopted?
- How are threats maintained?
- Which outputs are used?
- Which model workflows are active?

Pageviews use fixed, allow-listed paths for application areas. They do not include raw browser routes.
The server also forwards the request IP address and browser User-Agent.
Plausible uses this request data to calculate aggregate visitors, sessions, devices,
and approximate locations. The Threat Dragon analytics integration does not log these values.

### What is not collected

Threat Dragon does not send user content or identifying application data to Plausible. This includes:

- Threat model names, content, diagrams, threats, descriptions, owners, reviewers, contributors, and attachments
- Organization, repository, branch, folder, and file names
- Usernames, account IDs, access tokens, cookies, credentials, and authentication codes
- Raw browser routes, route parameters, query strings, referrers, and free-text input
- Exact edit-duration values, screen recordings, keystrokes, and pointer coordinates

Only the server can send analytics data, and it is an explicitly opt-in feature.
The server rejects anything not contained in the allow-list of events and property names/values.
Raw paths are not logged to avoid collecting model metadata. Timing telemetry is captured in broad
buckets. If Plausible is unavailable, analytics are discarded.

### Transparency

When analytics are enabled, Threat Dragon shows an animated chart icon in the header, linking to the
configured Plausible dashboard.

[https://www.threatdragon.com](https://www.threatdragon.com/) is configured to use a self-hosted instance
of Plausible.

Dashboards:

- [Main dashboard](https://analytics.threatdragon.com/share/threatdragon.com?auth=aCV0lHHVgvub06ga4z9by)
- [Application areas](https://analytics.threatdragon.com/share/threatdragon.com?auth=V0ELzy6vHE2eEQKcHV3SP)
- [Model workflows](https://analytics.threatdragon.com/share/threatdragon.com?auth=-2sskTQwJVjCbszgx6izf)
- [Editing session duration](https://analytics.threatdragon.com/share/threatdragon.com?auth=oqZgZ-ld4dQ-BsJMgdWho)
- [Language adoption](https://analytics.threatdragon.com/share/threatdragon.com?auth=T5wJ6xCqvjKfw0bDt-AFc)
- [Diagram workflows](https://analytics.threatdragon.com/share/threatdragon.com?auth=qY4zbuxFc6Cw_cVTL8RGN)
- [Threat workflows](https://analytics.threatdragon.com/share/threatdragon.com?auth=a_l01Z1B6a-JX5t5mrfEw)
- [Threat engine](https://analytics.threatdragon.com/share/threatdragon.com?auth=2kwgJvoGIX-ECkAlpUlUq)
- [Exports](https://analytics.threatdragon.com/share/threatdragon.com?auth=U0hxcACC1QuyeCp6mMY_L)

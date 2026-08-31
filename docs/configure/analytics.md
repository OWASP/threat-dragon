---
layout: page
title: Configure analytics
nav_order: 6
path: /configure/analytics
group: Configure
---

## Configure analytics

Analytics are disabled by default, and require explicit server config and a Plausible instance.
Read [Analytics and privacy]({{ '/trust/analytics.html' | relative_url }}) before you enable this feature.

### Choose a Plausible service

The integration uses the Plausible Events API. You can use Plausible Cloud or
[Plausible Community Edition (CE)][plausible-ce]. This guide assumes Plausible CE 3.2.1 or later.
On Plausible Cloud, shared links and site segments require Growth. Custom properties require Business.

### Configuring Plausible

Create a Plausible site, skip the JavaScript snippet, and copy its domain exactly to `PLAUSIBLE_DOMAIN`.

#### Configure event goals

For each event in the table:

1. Open the site dashboard.
2. Select the site name, then **Site Settings**.
3. Select **Goals**, then **+ Add goal**.
4. Select **Custom event**.
5. Enter the event name **exactly**, including capitalization and underscores.
6. Use the event name as the display name.
7. Leave custom-property constraints empty.
8. Select **Add goal**.

| Custom event goal |
| --- |
| `PROVIDER_SELECTED` |
| `PROVIDER_AUTHENTICATION_SUCCEEDED` |
| `THREAT_MODEL_OPENED` |
| `THREAT_MODEL_CREATED` |
| `THREAT_MODEL_SAVED` |
| `APPLICATION_LANGUAGE_USED` |
| `THREAT_MODEL_EDIT_SESSION_ENDED` |
| `DIAGRAM_CREATED` |
| `DIAGRAM_METHODOLOGY_USED` |
| `THREAT_CREATED_MANUALLY` |
| `THREAT_UPDATED` |
| `THREAT_STATUS_UPDATED` |
| `THREAT_DELETED` |
| `THREAT_SUGGESTIONS_REQUESTED` |
| `THREAT_SUGGESTION_APPLIED` |
| `THREAT_MODEL_TMBOM_EXPORTED` |
| `DIAGRAM_EXPORTED` |
| `THREAT_MODEL_REPORT_PRINT_REQUESTED` |

#### Custom properties

_Threat Dragon uses an allow-list for property values to help protect privacy._

1. Open **Site Settings** for the Threat Dragon site.
2. Select **Custom Properties**.
3. Select **Add property**.
4. Enter one property name from the table below.
5. Save the property and repeat for all seven names.

| Property | Threat Dragon's Allowed Values |
| --- | --- |
| `provider` | `local`, `github`, `gitlab`, `bitbucket`, `google` |
| `source` | `github`, `gitlab`, `bitbucket`, `google`, `import`, `demo`, `type`, `context` |
| `language` | `ar`, `de`, `el`, `en`, `es`, `fi`, `fr`, `hi`, `id`, `ja`, `ms`, `pt`, `pt-BR`, `zh` |
| `duration_bucket` | `LESS_THAN_5_MINUTES`, `FIVE_TO_FIFTEEN_MINUTES`, `FIFTEEN_TO_THIRTY_MINUTES`, `THIRTY_TO_SIXTY_MINUTES`, `SIXTY_PLUS_MINUTES` |
| `methodology` | `CIA`, `CIADIE`, `LINDDUN`, `PLOT4AI`, `STRIDE`, `EOP`, `GENERIC` |
| `status` | `NotApplicable`, `Open`, `Mitigated`, `Accepted`, `Transferred`, `Avoided`, `Eliminated` |
| `format` | `PNG`, `SVG` |

#### Segments (optional)

Plausible does not currently have custom dashboards, but it can create segments from filters.
Segments can be shared as links, and approximate "dashboards". These are only recommendations.
For `Application Areas`, visit all of the URLs before attempting to create the segment.

Create each segment in the table below:

1. Open the Threat Dragon site dashboard.
2. Clear all existing filters.
3. Select **Filter**.
4. Select the filter type shown in the table.
5. Set the operator to **is**.
6. Select all listed values in the same filter.
7. Apply the filter.
8. Open the filter menu and select **Save as segment**.
9. Select **Site segment**.
10. Enter the segment name exactly as shown.
11. Save the segment.

| Site segment | Filter | Values | What the segment shows |
| --- | --- | --- | --- |
| `Application areas` | **Page is** | `/`, `/dashboard`, `/demo-models`, `/repository-selection`, `/branch-selection`, `/threat-model-selection`, `/google-folder-selection`, `/import-model`, `/new-threat-model`, `/threat-model`, `/threat-model-edit`, `/diagram-editor`, `/threat-model-report` | Relative use of fixed application areas. Use **Top Pages**, entry pages, and exit pages to compare navigation patterns. |
| `Model workflows` | **Goal is** | `PROVIDER_SELECTED`, `PROVIDER_AUTHENTICATION_SUCCEEDED`, `THREAT_MODEL_OPENED`, `THREAT_MODEL_CREATED`, `THREAT_MODEL_SAVED` | Provider selection, remote authentication, model open, create, and save activity. |
| `Editing session duration` | **Goal is** | `THREAT_MODEL_EDIT_SESSION_ENDED` | Completed editing sessions grouped into coarse durations. Open **Properties**, then select `duration_bucket`. Active sessions appear only after the editor closes. |
| `Language adoption` | **Goal is** | `APPLICATION_LANGUAGE_USED` | Language use. Open **Properties**, then select `language`, to find translations that need more attention. |
| `Diagram workflows` | **Goal is** | `DIAGRAM_CREATED`, `DIAGRAM_METHODOLOGY_USED` | Diagram creation and methodology use. Select `DIAGRAM_METHODOLOGY_USED`, then break down the `methodology` property. |
| `Threat workflows` | **Goal is** | `THREAT_CREATED_MANUALLY`, `THREAT_UPDATED`, `THREAT_STATUS_UPDATED`, `THREAT_DELETED` | Manual threat creation, updates, status changes, and deletion. Break down `THREAT_STATUS_UPDATED` by `status`. |
| `Threat engine` | **Goal is** | `THREAT_SUGGESTIONS_REQUESTED`, `THREAT_SUGGESTION_APPLIED` | Suggestion requests and applied suggestions. Open each goal and break down `source` to compare type and context suggestions. |
| `Exports` | **Goal is** | `THREAT_MODEL_TMBOM_EXPORTED`, `DIAGRAM_EXPORTED`, `THREAT_MODEL_REPORT_PRINT_REQUESTED` | tmBOM exports, diagram exports, and print requests. Break down `DIAGRAM_EXPORTED` by `format`. |

#### Public links (optional)

Create one overview link without a segment. Then create one link for each site segment.

1. Open **Site Settings**, then **Visibility**.
2. Find **Shared links** and select **Add shared link**.
3. Enter the shared-link name from the table below.
4. Leave the password empty for a public dashboard.
5. Set **Limit to segment** as shown in the table.
6. Select the named site segment when the limit is enabled.
7. Create the link.
8. Copy or share the generated URL.

Use the overview URL for `PLAUSIBLE_DASHBOARD_URL`. The header chart icon opens this URL. Use the same URL for the
README dashboard link.

### Configure Threat Dragon

Add these values to the Threat Dragon server environment:

```text
PLAUSIBLE_ENABLED=true
PLAUSIBLE_EVENT_URL=https://plausible.example.com/api/event
PLAUSIBLE_DOMAIN=threatdragon.example.com
PLAUSIBLE_DASHBOARD_URL=https://plausible.example.com/share/threatdragon.example.com?auth=replace-with-shared-link-key
PLAUSIBLE_ALLOW_INSECURE=false
```

`PLAUSIBLE_DOMAIN` identifies the Threat Dragon site in Plausible. It is not the Plausible server hostname.

| Variable | Required when enabled | Description |
| --- | --- | --- |
| `PLAUSIBLE_ENABLED` | Yes | Set to `true` to enable analytics. The default is `false`. |
| `PLAUSIBLE_EVENT_URL` | Yes | The Plausible Events API endpoint. HTTPS is required by default. |
| `PLAUSIBLE_DOMAIN` | Yes | The Plausible site domain. Do not include a protocol or path. |
| `PLAUSIBLE_DASHBOARD_URL` | Yes | The public dashboard URL that the header indicator opens. |
| `PLAUSIBLE_ALLOW_INSECURE` | No | Allows HTTP URLs and disables certificate validation for server-side event requests. Browser certificate errors still apply. The default is `false`. |

[plausible-ce]: https://github.com/plausible/community-edition

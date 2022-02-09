---
layout: page
title: SBOM
nav_order: 0
path: /trust/sbom
group: Trust
---

# SBOMs

[CyclyoneDX](https://cyclonedx.org/) Software Bill of Materials are generated for the front-end, back-end and combined Threat Dragon projects.  These SBOMs are generated during the build of the docker image, and should always be an up-to-date version for the current snapshot / tag that is running.

Downloads:

{:.table .table-striped}
|Project|Format|Link|
|---|---|---|
|td.vue|json|[site_json_bom.json]({{ '/downloads/site_json_bom.json' | relative_url }})|
|td.vue|xml|[site_xml_bom.xml]({{ '/downloads/site_xml_bom.xml' | relative_url }})|
|td.server|json|[server_json_bom.json]({{ '/downloads/server_json_bom.json' | relative_url }})|
|td.server|xml|[server_xml_bom.xml]({{ '/downloads/server_xml_bom.xml' | relative_url }})|
|Canonical|json|[canonical_json_bom.json]({{ '/downloads/canonical_json_bom.json' | relative_url }})|
|Canonical|xml|[canonical_xml_bom.xml]({{ '/downloads/canonical_xml_bom.xml' | relative_url }})|


# Searchable SBOM:

{: .table .table-striped .td-data-table}
|Name|Version|Licenses|
|---|---|---|
{% for component in site.data.canonical_json_bom.components -%}
{%- assign website = component.externalReferences | where: "type", "website" | first -%}
{%- capture name -%}
{% if component.group -%}{{ component.group }}/{% endif %}{{ component.name }}
{%- endcapture -%}
{%- capture nameLink -%}
{% if website -%}<a href="{{ website.url }}" target="_blank" rel="noopener noreferrer">{{ name }}</a>{%- else -%}{{ name }}{%- endif -%}
{%- endcapture -%}
| {{ nameLink }} | {{ component.version }} | {%- if component.licenses -%}{{ component.licenses | map: 'license' | map: 'id' | join: ', ' }}{%- endif -%} |
{% endfor %}

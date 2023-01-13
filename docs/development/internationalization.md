---
layout: page
title: Internationalization
nav_order: 5
path: /internationalization
group: Internationalization
---

## [OWASP](https://www.owasp.org) Threat Dragon

Internationalization is enabled by [vue-i18n](https://kazupon.github.io/vue-i18n/).
This feature enables our community members to translate Threat Dragon,
increasing the diversity of the Threat Dragon community.

To add a new language:
- Add a new file with the ISO 639-2 code as the name (eg "deu" or "eng") in the `td.vue/src/i18n` directory
- Copy the contents of the `en.js` file to your new file and translation the application messages
- Import your file to `td.vue/src/i18n/index.js` and add it to the `messages` object in the `get` method
- Choose your new locale from the dropdown to test your translations

The following translations are available:

- English (eng-US)
- Ελληνικά (ell-GR)
- español (spa-ES)
- français (fra-CA)
- मानक हिन्दी (hin-IN)
- português (por-BR)
- 中文 (zho-CN)

By default, if a translation key cannot be found, it will fall-back to the default locale (`eng`).

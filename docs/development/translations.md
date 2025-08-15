---
layout: page
title: Translations
nav_order: 4
path: /development/translations
group: Development
---

## Translations

Internationalization is enabled by [vue-i18n](https://kazupon.github.io/vue-i18n/).
This feature enables our community members to translate Threat Dragon,
increasing the diversity of the Threat Dragon community.

The following translations are available:

- العربية (ara-SY)
- Deutsch (deu-DE)
- English (eng-US)
- Ελληνικά (ell-GR)
- español (spa-ES)
- Suomi; (fin-FI)
- français (fra-CA)
- मानक हिन्दी (hin-IN)
- Bahasa Indonesia (ind-ID)
- 日本語 (jpn)
- português (por-BR)
- Malay (msa-MY)
- 中文 (zho-CN)

By default, if a translation key cannot be found, it will fall-back to the default locale (`eng-US`).

To add a new language:

- Add a new file with the ISO 639-2 code as the name (eg "deu" or "eng") in the `td.vue/src/i18n` directory
- Copy the contents of the `en.js` file to the new file and translate the application messages
- Import the file to `td.vue/src/i18n/index.js` and add it to the `messages` object in the `get` method
- Choose the new locale from the dropdown to test your translations

----

Threat Dragon: _making threat modeling less threatening_

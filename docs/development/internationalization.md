---
layout: page
title: Internationalization
nav_order: 3
path: /internationalization
group: Internationalization
---

## [OWASP](https://www.owasp.org) Threat Dragon

Internationalization is enabled by [vue-i18n](https://kazupon.github.io/vue-i18n/).  At the time of writing, there are not any translations available.  Hopefully this feature enables our community members to translate the application to new languages so it can be used by more people.

To add a new language:
- Add a new file with the locale as the name (eg "de" or "en") in the `src/i18n` directory
- Copy the contents of the `en.js` file to your new file and make the translations
- Import your file to `src/i18n/index.js` and add it to the `messages` object in the `get` method
- Choose your new locale from the dropdown to test your translations

By default, if a translation key cannot be found, it will fall-back to the default locale (`en`)
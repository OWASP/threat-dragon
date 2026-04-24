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

### Locale identifiers

We follow **IETF BCP 47** language tags: `language`-`REGION` (case‑insensitive, but canonical form recommended).

- **Language**: ISO 639‑1 two‑letter code (lowercase) – e.g., `en`, `pt`, `zh`
- **Region** (optional): ISO 3166‑1 alpha‑2 country code (uppercase) – e.g., `BR`, `US`, `GB`

**Example:** `pt-BR` (Brazilian Portuguese). For a language without a region variant, use only the language code (e.g. `es`).

> **Why uppercase region?** BCP 47 is case‑insensitive, but the canonical form (e.g., `pt-BR`) matches browser APIs
(`navigator.language`) and is the convention used in `vue-i18n` examples. Our code uses the canonical form for the `messages`
object keys.

### Available translations

All translation files are located in `td.vue/src/i18n/`. Each file exports a single JavaScript object with the same nested
structure as `en.js`.

| Language                      | BCP 47  | Filename    | Status                                                      |
|-------------------------------|---------|-------------|-------------------------------------------------------------|
| العربية (Arabic)              | `ar`    | `ar.js`     | All keys present, some values are in English (untranslated) |
| Deutsch (German)              | `de`    | `de.js`     | All keys present, some values are in English (untranslated) |
| Ελληνικά (Greek)              | `el`    | `el.js`     | All keys present, some values are in English (untranslated) |
| English                       | `en`    | `en.js`     |                                                             |
| Español (Spanish)             | `es`    | `es.js`     | All keys present, some values are in English (untranslated) |
| Suomi (Finnish)               | `fi`    | `fi.js`     | All keys present, some values are in English (untranslated) |
| Français (French)             | `fr`    | `fr.js`     | All keys present, some values are in English (untranslated) |
| मानक हिन्दी (Hindi)           | `hi`    | `hi.js`     | All keys present, some values are in English (untranslated) |
| Bahasa Indonesia (Indonesian) | `id`    | `id.js`     | All keys present, some values are in English (untranslated) |
| 日本語 (Japanese)              | `ja`    | `ja.js`     | All keys present, some values are in English (untranslated) |
| Bahasa Malaysia (Malay)       | `ms`    | `ms.js`     | All keys present, some values are in English (untranslated) |
| Português (European)          | `pt`    | `pt.js`     | All keys present, very few English values (untranslated)    |
| Português do Brasil (Brazil)  | `pt-br` | `pt-br.js`  | All keys present, some values are in English (untranslated) |
| Русский (Russian)             | `ru`    | `ru.js`     | All keys present, some values are in English (untranslated) |
| Українська (Ukrainian)        | `uk`    | `uk.js`     | All keys present, some values are in English (untranslated) |
| 中文 (Chinese)                 | `zh`    | `zh.js`     | All keys present, some values are in English (untranslated) |

**Fallback behaviour**  
If a translation key is missing in the selected locale, the application falls back according to the `fallbackLocale`
configuration in `td.vue/src/i18n/index.js`.  

Currently:

- European Portuguese (`pt`) falls back to Brazilian Portuguese (`pt-BR`)
- All other locales fall back to English (`en`)

> **Note:** The fallback is **one‑way** (`pt-BR` → `pt`). Portuguese does not fall back to Brazilian Portuguese (you need to
configure it).

### Adding a new language

1. **Create a new file** in `td.vue/src/i18n` using the **IETF language tag** as the filename (e.g., `pt-br.js`, `en-gb.js`,
`zh-cn.js`).
    - For a language without a region variant, use the two‑letter ISO 639‑1 code (e.g., `de.js`).
    - For region‑specific variants, append `-` and the two‑letter ISO 3166‑1 alpha‑2 country code (lowercase) to the base
     language.

2. **Default contents** – Copy the structure from `en.js` and translate the values.

3. **Import the new file** in `td.vue/src/i18n/index.js` and add it to the `messages` object, using the IETF tag as the key.

4. **Configure fallback relationships** – in `td.vue/src/i18n/index.js`, if the new language should fall back to another
(e.g., a regional variant to its base language), add the appropriate entry to the `fallbackLocale` object in `index.js`.
The syntax is:

   ```javascript
   fallbackLocale: {
       'new_locale': ['fallback1', 'fallback2'],
       'default': 'en'
   }
   ```

5. **Test your translations** by selecting the new locale from the dropdown menu.
    - **For bonus points**, test the fallback configuration: temporarily remove a specific translation key from your new
    locale file. When you reload the application with that locale selected, the fallback language (as configured in
    `fallbackLocale` in `index.js`) should display the missing key. This confirms that the fallback chain works correctly and
     that users will always see a meaningful translation even if your file is incomplete.

----

Threat Dragon: _making threat modeling less threatening_

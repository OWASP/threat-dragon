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

We follow **IETF BCP 47** language tags: `language`-`REGION` (case‑insensitive, but canonical form is used internally).

- **Language**: ISO 639‑1 two‑letter code (lowercase) – e.g., `en`, `pt`, `zh`
- **Region** (optional): ISO 3166‑1 alpha‑2 country code (uppercase) – e.g., `BR`, `US`, `GB`

**Example:** `pt-BR` (Brazilian Portuguese). For a language without a region variant, use only the language code (e.g. `es`).

> **Why uppercase region?** BCP 47 is case‑insensitive, but the canonical form (e.g., `pt-BR`) matches browser APIs
(`navigator.language`) and is the convention used in `vue-i18n` examples. Our code uses canonical form for the `messages`
object keys and for the exported `SUPPORTED_LOCALES` array.

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
| Português do Brasil (Brazil)  | `pt-BR` | `pt-br.js`  | All keys present, some values are in English (untranslated) |
| Русский (Russian)             | `ru`    | `ru.js`     | All keys present, some values are in English (untranslated) |
| Українська (Ukrainian)        | `uk`    | `uk.js`     | All keys present, some values are in English (untranslated) |
| 中文 (Chinese)                 | `zh`    | `zh.js`     | All keys present, some values are in English (untranslated) |

> **Note:** Russian (`ru`) and Ukrainian (`uk`) translation files are present in the `i18n/` directory but are
**currently commented out** in `td.vue/src/i18n/index.js` — they are not included in the exported `SUPPORTED_LOCALES`
array and therefore are not selectable in the application. To enable them, uncomment the corresponding imports and add
them to the `messages` object in `index.js`.

### Locale resolution

The application resolves the active locale through a **multi‑step pipeline** defined in
`td.vue/src/service/locale/locale-resolver.js` and orchestrated by `td.vue/src/store/modules/locale.js`:

1. **Saved preference** – If the user previously selected a locale and it is still allowed by the server configuration,
   that locale is restored.
2. **Browser languages** – If no saved preference (or the saved locale is no longer allowed), the application reads
   `navigator.languages` and picks the first one that matches a supported locale.
3. **Server default** – If no browser locale matches, the server-configured `defaultLocale` (from the `LOCALE_DEFAULT`
   environment variable) is used.
4. **Fallback** – If none of the above produce a match, the hardcoded `DEFAULT_LOCALE` (`'en'`) is used.

### Server-driven locale restriction

The server can **restrict** which locales are available through the `/api/config` endpoint.

| Environment variable | Description | Default |
|----------------------|-------------|---------|
| `LOCALES_ALLOWED` | JSON array of allowed locale codes, e.g. `["en","es","fr"]`. When empty or not set, all supported locales are available. | `[]` |
| `LOCALE_DEFAULT` | Default locale the server suggests, e.g. `pt` or `en`. Must be a supported locale. | `en` |

The server first canonicalizes each entry via `Intl.getCanonicalLocales()`, and the frontend further filters against
`SUPPORTED_LOCALES`. This ensures that even if the server broadcasts unknown locale codes, they are never surfaced
in the UI.

The resolved `allowedLocales` are exposed through the Vuex getter `availableLocales`, which the `LocaleSelect`
component uses to populate its dropdown. The `defaultLocale` from the server overrides the `fallbackLocale.default`
in the i18n instance so that the fallback chain uses the organisation's preferred language rather than always English.

### Constants

The module `td.vue/src/i18n/index.js` exports two useful constants:

- **`DEFAULT_LOCALE`** – always `'en'`. This is used as the ultimate fallback when neither browser nor server can
  determine a matching locale.
- **`SUPPORTED_LOCALES`** – a frozen array of all locale codes that have a translation file loaded (e.g.
  `['ar', 'de', 'el', 'en', ...]`). This is used across the store, the locale resolver, and the UI components to gate
  which locales are valid.

**Fallback behaviour**  
If a translation key is missing in the selected locale, the application falls back according to the `fallbackLocale`
configuration, which is the combination of static rules in `td.vue/src/i18n/index.js` and the
**server‑provided `defaultLocale`**:

**Static rules** (defined in `index.js`):

- European Portuguese (`pt`) falls back to Brazilian Portuguese (`pt-BR`)
- All other locales fall back to English (`en`)

**Dynamic override** (applied at runtime by `locale.js`):

- After the config is fetched from `/api/config`, the server's `defaultLocale` overrides the `fallbackLocale.default`
  value. This means operators can set a preferred fallback language (e.g. Japanese for an organisation based in Japan)
  without modifying the application code.

> **Note:** The static fallback is **one‑way** (`pt` → `pt-BR`). `pt` does not fall back to Brazilian Portuguese by default,
  unless you add it to the `fallbackLocale` object.

### Adding a new language

1. **Create a new file** in `td.vue/src/i18n` using the canonical IETF language tag as the filename (e.g., `pt-br.js`,
`zh-cn.js`).
    - For a language without a region variant, use the two‑letter ISO 639‑1 code (e.g., `de.js`).
    - For region‑specific variants, append `-` and the two‑letter ISO 3166‑1 alpha‑2 country code (lowercase) to the base
     language.

2. **Default contents** – Copy the structure from `en.js` and translate the values.

3. **Import the new file** in `td.vue/src/i18n/index.js` and add it to the `messages` object, using the IETF tag as the key.
   The new locale will be **automatically included** in the exported `SUPPORTED_LOCALES` array (which derives from
   `Object.keys(messages)`), and it will appear in the `LocaleSelect` dropdown (subject to server `allowedLocales`
   filtering).

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
    `fallbackLocale` in `index.js` or the server's `defaultLocale`) should display the missing key. This confirms that the
    fallback chain works correctly and that users will always see a meaningful translation even if your file is incomplete.

----

Threat Dragon: _making threat modeling less threatening_

import { createI18n } from 'vue-i18n';

// the language codes follow
// Internet Engineering Task Force (IETF) Best Current Practice (BCP) 47
// using codes from ISO 639-2

import ell from './el.js';
import eng from './en.js';
import spa from './es.js';
import deu from './de.js';
import fra from './fr.js';
import hin from './hi.js';
import por from './pt.js';
import rus from './ru.js';
import ukr from './uk.js';
import zho from './zh.js';

export const i18n = createI18n({
  locale: 'eng',
  allowComposition: true,
  messages: { deu, ell, eng, spa, fra, hin, por, rus, ukr, zho }
});

export const t = (key) => {
  return i18n.global.t(key);
};

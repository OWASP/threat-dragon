

const fs = require('fs');
const path = require('path');
const axios = require('axios');


const API_LANGS = [
    { lang: 'es', url: 'https://cornucopia.owasp.org/api/cre/webapp/es' },
    { lang: 'fr', url: 'https://cornucopia.owasp.org/api/cre/webapp/fr' },
    { lang: 'ru', url: 'https://cornucopia.owasp.org/api/cre/webapp/ru' },
    { lang: 'en', url: 'https://cornucopia.owasp.org/api/cre/webapp/en' },
];
const OUT_DIR = path.resolve(__dirname, '..', 'service', 'schema');
const API_JSON_DIR = path.resolve(OUT_DIR, 'api_json');
const BYPASS = process.argv.includes('--bypass');


(async () => {
    if (BYPASS) {
        process.exit(0);
    }
    try {
        fs.mkdirSync(OUT_DIR, { recursive: true });
        fs.mkdirSync(API_JSON_DIR, { recursive: true });
        for (const { lang, url } of API_LANGS) {
            const outFile = path.join(API_JSON_DIR, `cornucopia-${lang}.json`);
            try {
                const res = await axios.get(url, { timeout: 15000, headers: { Accept: 'application/json' } });
                if (res.status !== 200) {
                    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
                }
                if (!res.data) throw new Error('Empty response');
                fs.writeFileSync(outFile, JSON.stringify(res.data, null, 2), 'utf8');
            } catch (err) {
                console.error('Error fetching:', err.message);
            }
        }
        process.exit(0);
    } catch (err) {
        console.error('Error fetching:', err.message);
        process.exit(1);
    }
})();
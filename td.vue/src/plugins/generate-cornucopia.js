
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const apiLangs = [
    { lang: 'es', type: 'webapp' },
    { lang: 'fr', type: 'webapp' },
    { lang: 'ru', type: 'webapp' },
    { lang: 'en', type: 'webapp' },

    // mobileapp currently only supports english
    { lang: 'en', type: 'mobileapp' },

    // companion currently only supports english
    { lang: 'en', type: 'companion' },

    // eop currently only supports english
    { lang: 'en', type: 'eop' }
];

const outDir = path.resolve(__dirname, '..', 'assets', 'downloads');
const apiJsonDir = path.resolve(outDir, 'cornucopia');
const bypass = process.argv.includes('--bypass');

(async () => {
    if (bypass) {
        process.exit(0);
    }
    try {
        fs.mkdirSync(outDir, { recursive: true });
        fs.mkdirSync(apiJsonDir, { recursive: true });
        for (const { lang, type } of apiLangs) {
            const url = `https://cornucopia.owasp.org/api/cre/${type}/${lang}`;
            const outFile = path.join(apiJsonDir, `cornucopia-${type}-${lang}.json`);
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
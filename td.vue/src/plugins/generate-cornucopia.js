#!/usr/bin/env node
 
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_URL = 'https://cornucopia.owasp.org/api/cre/webapp/en';
const OUT_DIR = path.resolve(process.cwd(), 'src', 'service', 'schema');
const OUT_FILE = path.join(OUT_DIR, 'cornucopia.json');
const BYPASS = process.argv.includes('--bypass');
console.log(OUT_FILE);

(async () => {
    if (BYPASS) {
        process.exit(0);
    }
    try {
        const res = await axios.get(API_URL, { timeout: 15000, headers: { Accept: 'application/json' } });

        if (res.status !== 200) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        if (!res || !res.data) throw new Error('Empty response');

        fs.mkdirSync(OUT_DIR, { recursive: true });
        fs.writeFileSync(OUT_FILE, JSON.stringify(res.data, null, 2), 'utf8');
        process.exit(0);
    } catch (err) {
        console.error('Error fetching:', err.message);
        process.exit(1);
    }
})();

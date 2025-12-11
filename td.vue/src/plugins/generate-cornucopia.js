#!/usr/bin/env node

// comandos FS
const fs = require('fs');
// construir rutas de archivos y unirlo
const path = require('path');
// cliente HTTP basado en promesas 
const axios = require('axios');


//url de la api de cornucopia 
const API_URL = 'https://cornucopia.owasp.org/api/cre/webapp/en';
// directorio de donde pongo el json
const OUT_DIR = path.resolve(process.cwd(), 'src', 'service', 'schema');
//directorio con archivoo 
const OUT_FILE = path.join(OUT_DIR, 'cornucopia.json');
//argumento para pasar de largo en caso de error
const BYPASS = process.argv.includes('--bypass');
console.log(OUT_FILE);

(async () => {
    if (BYPASS) {   
        process.exit(0);
     }
    try {
        const res = await axios.get(API_URL, { timeout: 15000, headers: { Accept: 'application/json' } });
        // 2. http distinto de 200
        if (res.status !== 200) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        //si el json viene vacio
        if (!res || !res.data) throw new Error('Empty response');

        // me fijo que este creado con mkdir -p
        fs.mkdirSync(OUT_DIR, { recursive: true });

        // pongo toda la data con 2 de indentacion 
        fs.writeFileSync(OUT_FILE, JSON.stringify(res.data, null, 2), 'utf8');
        process.exit(0);
    } catch (err) {
        console.error('Error fetching:', err.message);
        process.exit(1);
    }
})();

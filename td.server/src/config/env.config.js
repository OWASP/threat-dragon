import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const tryLoadDotEnv = () => {
    const upDir = `..${path.sep}`;
    const dotEnvPath = path.join(__dirname, upDir, upDir, upDir, '.env');
    if (fs.existsSync(dotEnvPath)) {
        dotenv.config();
    }
};

export default { tryLoadDotEnv };

import { Env } from './Env.js';

class EncryptionEnv extends Env {
    constructor () {
        super('Encryption');
    }

    get prefix () {
        return 'ENCRYPTION_';
    }

    // Note that the actual env var will be prepended with ENCRYPTION_
    get properties () {
        return [
            { key: 'KEYS', required: true },
            { key: 'JWT_SIGNING_KEY', required: true },
            { key: 'JWT_REFRESH_SIGNING_KEY', required: true }
        ];
    }
}

export default EncryptionEnv;

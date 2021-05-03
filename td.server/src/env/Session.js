import { Env } from './Env.js';

class SessionEnv extends Env {
    constructor() {
        super('Session');
    }

    get prefix() {
        return 'SESSION_';
    }

    get properties() {
        return [
            { key: 'STORE', required: true },
            { key: 'SIGNING_KEY', required: true },
            { key: 'ENCRYPTION_KEYS', required: true }
        ];
    }
}

export default SessionEnv;

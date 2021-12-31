import { Env } from './Env.js';

class ThreatDragonEnv extends Env {
    constructor() {
        super('ThreatDragon');
    }

    get prefix() {
        return '';
    }

    get properties() {
        return [
            { key: 'NODE_ENV', required: false },
            { key: 'PORT', required: false },
            { key: 'LOG_MAX_FILE_SIZE', required: false, defaultValue: 24 },
            { key: 'LOG_LEVEL', required: true, defaultValue: 'info' },
            { key: 'PROTOCOL', required: false, defaultValue: 'https' }
        ];
    }
}

export default ThreatDragonEnv;

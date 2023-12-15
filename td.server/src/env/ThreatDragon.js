import { Env } from './Env.js';

class ThreatDragonEnv extends Env {
    constructor () {
        super('ThreatDragon');
    }

    get prefix () {
        return '';
    }

    // if any  of the defaults are changed then ensure docs are updated in development/environment.md
    get properties () {
        return [
            { key: 'NODE_ENV', required: false, defaultValue:  'production'},
            { key: 'PORT', required: false, defaultValue: 3000 },
            { key: 'LOG_MAX_FILE_SIZE', required: false, defaultValue: 24 },
            { key: 'LOG_LEVEL', required: false, defaultValue: 'warn' },
            { key: 'SERVER_API_PROTOCOL', required: false, defaultValue: 'https' }
        ];
    }
}

export default ThreatDragonEnv;

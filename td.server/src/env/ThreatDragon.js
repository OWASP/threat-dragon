import { Env } from './Env.js';

class ThreatDragonEnv extends Env {
    constructor () {
        super('ThreatDragon');
    }

    get prefix () {
        return '';
    }

    // if any  of the defaults are changed then ensure docs are updated in development/environment.md
    // if the default PORT is changed then ensure the CI pipeline still works
    get properties () {
        return [
            { key: 'NODE_ENV', required: false, defaultValue:  'production'},
            { key: 'PORT', required: false, defaultValue: 3000 },
            { key: 'LOG_MAX_FILE_SIZE', required: false, defaultValue: 24 },
            { key: 'LOG_LEVEL', required: false, defaultValue: 'warn' },
            { key: 'SERVER_API_PROTOCOL', required: false, defaultValue: 'https' },
            { key: 'REPO_ROOT_DIRECTORY', required: false, defaultValue: 'ThreatDragonModels' },
            { key: 'REPO_USE_SEARCH', required: false, defaultValue: false },
            { key: 'REPO_SEARCH_QUERY', required: false }
        ];
    }
}

export default ThreatDragonEnv;

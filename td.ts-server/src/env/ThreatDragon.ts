import { Env, TdProviderProperty } from './Env';

export class ThreatDragonEnv extends Env {
    constructor() {
        super('ThreatDragon');
    }

    get prefix(): string {
        return '';
    }

    get properties(): TdProviderProperty[] {
        // if any  of the defaults are changed then ensure docs are updated at docs/development/env.md
        return [
            { key: 'NODE_ENV', required: false, defaultValue: 'dev' },
            { key: 'PORT', required: false, defaultValue: 3000 },
            { key: 'LOG_MAX_FILE_SIZE', required: false, defaultValue: 24 },
            { key: 'LOG_LEVEL', required: true, defaultValue: 'info' },
            { key: 'SERVER_API_PROTOCOL', required: false, defaultValue: 'https' }
        ];
    }
}

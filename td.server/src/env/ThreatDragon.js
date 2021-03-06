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
            { key: 'IS_TEST', required: false}
        ];
    }
}

export default ThreatDragonEnv;

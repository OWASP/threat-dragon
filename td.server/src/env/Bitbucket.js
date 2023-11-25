import { Env } from './Env.js';

class BitbucketEnv extends Env {
    constructor () {
        super('Bitbucket');
    }

    get prefix () {
        return 'BITBUCKET_';
    }

    get properties () {
        return [
            { key: 'CLIENT_ID', required: false },
            { key: 'CLIENT_SECRET', required: false },
            { key: 'SCOPE', required: false },
            { key: 'ENTERPRISE_HOSTNAME', required: false },
            { key: 'ENTERPRISE_PROTOCOL', required: false },
            { key: 'ENTERPRISE_PORT', required: false },
            { key: 'USE_SEARCH', required: false },
            { key: 'SEARCH_QUERY', required: false },
            { key: 'WORKSPACE', required: false }
        ];
    }
}

export default BitbucketEnv;

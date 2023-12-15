import { Env } from './Env.js';

class BitbucketEnv extends Env {
    constructor () {
        super('Bitbucket');
    }

    get prefix () {
        return 'BITBUCKET_';
    }

    // Note that the actual env var will be prepended with BITBUCKET_
    get properties () {
        return [
            { key: 'CLIENT_ID', required: false },
            { key: 'CLIENT_SECRET', required: false },
            { key: 'SCOPE', required: false, defaultValue: 'public_repo' },
            { key: 'ENTERPRISE_HOSTNAME', required: false },
            { key: 'ENTERPRISE_PORT', required: false, defaultValue: 443 },
            { key: 'ENTERPRISE_PROTOCOL', required: false, defaultValue: 'https' },
            { key: 'USE_SEARCH', required: false, defaultValue: false },
            { key: 'SEARCH_QUERY', required: false },
            { key: 'WORKSPACE', required: false }
        ];
    }
}

export default BitbucketEnv;

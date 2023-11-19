import { Env } from './Env.js';

class GithubEnv extends Env {
    constructor () {
        super('Github');
    }

    get prefix () {
        return 'GITHUB_';
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
            { key: 'SEARCH_QUERY', required: false }
        ];
    }
}

export default GithubEnv;

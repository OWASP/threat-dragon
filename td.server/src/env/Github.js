import { Env } from './Env.js';

class GithubEnv extends Env {
    constructor () {
        super('Github');
    }

    get prefix () {
        return 'GITHUB_';
    }

    // Note that the actual env var will be prepended with GITHUB_
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
            { key: 'REPO_ROOT_DIRECTORY', required: false }
        ];
    }
}

export default GithubEnv;

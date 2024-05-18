import { Env } from './Env.js';

class GitlabEnv extends Env {
    constructor () {
        super('Gitlab');
    }

    get prefix () {
        return 'GITLAB_';
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
            { key: 'REDIRECT_URI', required: false },
            { key: 'REPO_ROOT_DIRECTORY', required: false }
        ];
    }
}

export default GitlabEnv;

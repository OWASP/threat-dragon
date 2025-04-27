import { Env } from './Env.js';

class GitlabEnv extends Env {
    constructor() {
        super('Gitlab');
    }

    get prefix() {
        return 'GITLAB_';
    }

    // Note that the actual env var will be prepended with GITLAB_
    get properties() {
        return [
            { key: 'CLIENT_ID', required: false },
            { key: 'CLIENT_SECRET', required: false },
            {
                key: 'SCOPE',
                required: false,
                defaultValue: 'read_user write_repository profile read_api api'
            },
            { key: 'HOST', required: false },
            { key: 'REDIRECT_URI', required: false },
            { key: 'REPO_ROOT_DIRECTORY', required: false }
        ];
    }
}

export default GitlabEnv;

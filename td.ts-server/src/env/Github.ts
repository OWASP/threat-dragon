import { Env, TdProviderProperty } from './Env';

export class GithubEnv extends Env {
    constructor() {
        super('Github');
    }

    get prefix(): string {
        return 'GITHUB_';
    }

    override get properties(): TdProviderProperty[] {
        return [
            { key: 'CLIENT_ID', required: true, defaultValue: null },
            { key: 'CLIENT_SECRET', required: true, defaultValue: null },
            { key: 'SCOPE', required: false, defaultValue: null }
        ];
    }
}

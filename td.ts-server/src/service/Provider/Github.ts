import axios from 'axios';

import { Env, getEnv } from '../../env/Env';
import { ITdUser } from '../../entity';
import { IOAuthProvider } from './Provider';

export class GithubOAuthProvider implements IOAuthProvider {
    private readonly env: Env;
    
    // TODO: Create repo

    constructor() {
        this.env = getEnv();
    }

    get name(): string {
        return 'github';
    }

    get isConfigured(): boolean {
        return !!this.env.config.GITHUB_CLIENT_ID;
    }

    get redirectUrl(): string {
        const scope = this.env.config.GITHUB_SCOPE || 'public_repo';
        return `https://github.com/login/oauth/authorize?scope=${scope}&client_id=${this.env.config.GITHUB_CLIENT_ID}`;
    }

    getReturnUrl(code: string): string {
        let returnUrl = `/#/oauth-return?code=${code}`;
        if (this.env.config.NODE_ENV === 'development') {
            returnUrl = `http://localhost:8080${returnUrl}`;
        }
        return returnUrl;
    }

    async completeLogin(code: string): Promise<{ user: ITdUser; opts: any; }> {
        const url = `https://github.com/login/oauth/access_token`;
        const body = {
            client_id: this.env.config.GITHUB_CLIENT_ID,
            client_secret: this.env.config.GITHUB_CLIENT_SECRET,
            code
        };
        const options = {
            headers: {
                accept: 'application/json'
            }
        };
    
        const providerResp = await axios.post(url, body, options);
        const fullUser = await this.repo.userAsync(providerResp.data.access_token);
        const user = {
            username: fullUser.login,
            repos_url: fullUser.repos_url
        };
        return {
            user,
            opts: providerResp.data
        };
    }

}
import { Env } from './Env.js';

class GoogleEnv extends Env {
    constructor () {
        super('Google');
    }

    get prefix () {
        return 'GOOGLE_';
    }

    // Note that the actual env var will be prepended with GOOGLE_
    get properties () {
        return [
            { key: 'CLIENT_ID', required: false },
            { key: 'CLIENT_SECRET', required: false },
            { key: 'SCOPE', required: false, defaultValue: 'openid email profile' },
            { key: 'REDIRECT_URI', required: false, defaultValue: 'http://localhost:8080/oauth-return' },
            { key: 'TOKEN_URL', required: false, defaultValue: 'https://oauth2.googleapis.com/token' },
            { key: 'USER_INFO_URL', required: false, defaultValue: 'https://www.googleapis.com/oauth2/v1/userinfo' }
        ];
    }
}

export default GoogleEnv;

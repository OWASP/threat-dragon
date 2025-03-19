import { Env } from './Env.js';

class GoogleEnv extends Env {
    constructor () {
        super('Google');
    }

    get prefix () {
//        return 'GOOGLE_';
        return '';
    }

    // Note that the actual env var will be prepended with GOOGLE_
    get properties () {
        return [
            { key: 'VUE_APP_GOOGLE_CLIENT_ID', required: false },
            { key: 'GOOGLE_CLIENT_SECRET', required: false },
            { key: 'GOOGLE_REDIRECT_URI', required: false, defaultValue: 'http://localhost:3000/api/oauth/return' },
        ];
    }
}

export default GoogleEnv;

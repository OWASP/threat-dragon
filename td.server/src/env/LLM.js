import { Env } from './Env.js';

class LLMEnv extends Env {
    constructor () {
        super('LLM');
    }

    get prefix () {
        return '';
    }

    // if any  of the defaults are changed then ensure docs are updated in development/environment.md
    get properties () {
        return [
            { key: 'OPENAI_API_KEY', required: true},
            { key: 'OPENAI_BASE_URL', required: true},
        ];
    }
}

export default LLMEnv;

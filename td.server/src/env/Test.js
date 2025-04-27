import { Env } from './Env.js';

/**
 * Environment configuration for testing
 * This class is used only for unit tests and should not be used in production
 */
class TestEnv extends Env {
    constructor() {
        super('Test');
    }

    get prefix() {
        return 'TEST_';
    }

    get properties() {
        return [
            { key: 'TEST1', required: false, defaultValue: 'default-test1' },
            { key: 'TEST2', required: false, defaultValue: 'default-test2' }
        ];
    }
}

export default TestEnv;

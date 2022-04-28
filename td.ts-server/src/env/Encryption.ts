import { Env, TdProviderProperty } from './Env';

export class EncryptionEnv extends Env {
    constructor() {
        super('Encryption');
    }

    get prefix(): string {
        return 'ENCRYPTION_';
    }

    override get properties(): TdProviderProperty[] {
        return [
            { key: 'KEYS', required: true, defaultValue: null },
            { key: 'JWT_SIGNING_KEY', required: true, defaultValue: null },
            { key: 'JWT_REFRESH_SIGNING_KEY', required: true, defaultValue: null }
        ];
    }
}

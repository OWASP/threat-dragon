import jsonwebtoken from 'jsonwebtoken';

import { ITdProvider, ITdUser, ProviderNames } from '../entity';
import { EncryptionService } from './EncryptionService';
import { Env, getEnv } from '../env/Env';

export class JwtService {
    private readonly env: Env;
    private readonly cryptoService: EncryptionService;

    constructor() {
        this.env = getEnv();
        this.cryptoService = new EncryptionService();
    }

    createAsync(providerName: ProviderNames, providerOptions: any, user: ITdUser): { accessToken: string, refreshToken: string } {
        const encryptedProviderOptions = this.cryptoService.encrypt(JSON.stringify(providerOptions));
        const providerOptsEncoded = Buffer.from(JSON.stringify(encryptedProviderOptions)).toString('base64');
        const provider = {
            [providerName]: providerOptsEncoded
        };

        const accessToken = jsonwebtoken.sign({ provider, user }, this.env.config.ENCRYPTION_JWT_SIGNING_KEY, {
            expiresIn: '5m'
        });

        const refreshToken = jsonwebtoken.sign({ provider, user }, this.env.config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY, {
            expiresIn: '24h'
        });

        return {
            accessToken,
            refreshToken
        };
    }

    verifyRefresh(token: string): { provider: ITdProvider, user: ITdUser } {
        return this.decode(token, this.env.config.ENCRYPTION_JWT_REFRESH_SIGNING_KEY);
    }

    verifyToken(token: string): { provider: ITdProvider, user: ITdUser } {
        return this.decode(token, this.env.config.ENCRYPTION_JWT_SIGNING_KEY);
    }

    private decode(token: string, key: string): { provider: ITdProvider, user: ITdUser } {
        const { provider, user } = jsonwebtoken.verify(token, key) as { provider: {[key: string]: string}, user: ITdUser };
        const decodedProvider = this.decodeProvider(provider);
        return {
            provider: decodedProvider,
            user
        };
    }

    private decodeProvider(encodedProvider: {[key: string]: string}): ITdProvider {
        const providerName = Object.keys(encodedProvider)[0];
        const decodedProvider = JSON.parse(Buffer.from(encodedProvider[providerName], 'base64').toString('utf-8'));
        const provider = JSON.parse(this.cryptoService.decrypt(decodedProvider));
        provider.name = providerName;
        return provider;
    }
}
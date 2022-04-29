import { GithubOAuthProvider } from './Github';
import { IAuthProvider } from './Provider';

const providers: { [ key: string ]: IAuthProvider } = {
    'github': new GithubOAuthProvider()
};

export const getProviderByName = (name: string): IAuthProvider => {
    const lowerName = (name || '').toLowerCase();
    const provider = providers[lowerName];

    if (!provider) {
        throw new Error(`Unknown provider: ${lowerName}`);
    }

    if (!provider.isConfigured) {
        throw new Error(`Provider ${name} is not configured.  See setup-env.md for more info.`);
    }

    return provider;
};

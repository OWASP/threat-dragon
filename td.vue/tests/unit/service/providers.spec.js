import providers from '@/service/providers.js';

describe('service/providers.js', () => {
    describe('allProviders', () => {
        it('is an object', () => {
            expect(providers.allProviders).toBeInstanceOf(Object);
        });

        it('prevents mutations', () => {
            expect(() => {
                providers.allProviders.github = 'foobar';
            }).toThrowError('Cannot assign to read only property');
        });
    });

    describe('getDashboardActions', () => {
        it('throws an error for an unknown provider', () => {
            const provider = 'fake';
            expect(() => {
                providers.getDashboardActions(provider);
            }).toThrowError(`Unknown provider: ${provider}`);
        });

        it('gets the github provider dashboard actions', () => {
            const actual = providers.getDashboardActions(providers.allProviders.github);
            expect(actual.length).toBeGreaterThan(0);
        });

        it('throws an error when no actions are configured', () => {
            expect(() => {
                providers.getDashboardActions('testingOnly')
            }).toThrowError(`No dashboard actions configured`);
        });
    });
});

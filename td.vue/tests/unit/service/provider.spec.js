import providers from '@/service/providers.js';

describe('service/providers.js', () => {
    describe('allProviders', () => {
        it('is an object', () => {
            expect(providers.allProviders).toBeInstanceOf(Object);
        });

        it('prevents mutations', () => {
            providers.allProviders.github = 'foobar';
            expect(providers.allProviders.github).toEqual('github');
        });
    });
});

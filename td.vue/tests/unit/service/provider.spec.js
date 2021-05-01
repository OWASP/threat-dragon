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
});

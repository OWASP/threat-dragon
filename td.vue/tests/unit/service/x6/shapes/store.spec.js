import store from '@/service/x6/shapes/store.js';

describe('service/x6/shapes/store.js', () => {
    let victim;

    beforeEach(() => {
        victim = new store.Store();
    });

    it('can create the object', () => {
        expect(victim.constructor.name).toEqual('Store');
    });
});

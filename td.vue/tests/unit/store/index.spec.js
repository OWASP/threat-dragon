import Vuex from 'vuex';

import storeFactory from '@/store/index.js';

describe('store.get()/index.js', () => {
    let store;

    beforeEach(() => {
        store = storeFactory.get();
    });

    it('is a vuex store', () => {
        expect(store).toBeInstanceOf(Vuex.Store);
    });

    it('defines the auth module', () => {
        expect(store.state.auth).toBeInstanceOf(Object);
    });

    it('defines the branch module', () => {
        expect(store.state.branch).toBeInstanceOf(Object);
    });

    it('defines the provider module', () => {
        expect(store.state.provider).toBeInstanceOf(Object);
    });

    it('defines the repo module', () => {
        expect(store.state.repo).toBeInstanceOf(Object);
    });

    it('defines the threatmodel module', () => {
        expect(store.state.threatmodel).toBeInstanceOf(Object);
    });
});

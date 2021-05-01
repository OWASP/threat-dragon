import Vuex from 'vuex';

import store from '@/store/index.js';

describe('store/index.js', () => {
    it('is a vuex store', () => {
        expect(store).toBeInstanceOf(Vuex.Store);
    });

    it('defines the provider module', () => {
        expect(store.state.provider).toBeInstanceOf(Object);
    });
});

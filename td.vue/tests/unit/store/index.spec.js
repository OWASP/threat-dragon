import Vuex from 'vuex';

import store from '@/store/index.js';

xdescribe('store/index.js', () => {
    it('is a vuex store', () => {
        expect(store).toBeInstanceOf(Vuex.Store);
    });

    it('defines the datasource module', () => {
        expect(store.state.datasource).toBeInstanceOf(Object);
    });

    it('defines the auth module', () => {
        expect(store.state.auth).toBeInstanceOf(Object);
    });
});

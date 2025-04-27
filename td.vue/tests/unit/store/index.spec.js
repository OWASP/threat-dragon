import { createStore as _createStore } from 'vuex';
import defaultStore, { store } from '@/store/index.js';

describe('store/index.js', () => {
    it('exports both a factory and direct store', () => {
        // Factory pattern should have get method
        expect(defaultStore.get).toBeInstanceOf(Function);
        // Direct store should be available
        expect(store).toBeDefined();
    });

    it('is a vuex store created with createStore', () => {
        // In Vue 3, the store is created with createStore and doesn't have a prototype to check
        // We can validate it has the expected store methods
        expect(store.commit).toBeInstanceOf(Function);
        expect(store.dispatch).toBeInstanceOf(Function);
        expect(store.getters).toBeInstanceOf(Object);
    });

    it('defines the auth module', () => {
        expect(store.state.auth).toBeInstanceOf(Object);
    });

    it('defines the branch module', () => {
        expect(store.state.branch).toBeInstanceOf(Object);
    });

    it('defines the loader module', () => {
        expect(store.state.loader).toBeInstanceOf(Object);
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

    it('defines the cell module', () => {
        expect(store.state.cell).toBeInstanceOf(Object);
    });
});

import { createStore } from 'vuex';
import { LOADER_FINISHED, LOADER_STARTED } from '@/store/actions/loader.js';
import loaderModule from '@/store/modules/loader.js';

describe('store/modules/loader.js', () => {
    let testStore;
    let mockCommit;
    
    beforeEach(() => {
        // Create a fresh clone of the module state to prevent cross-test pollution
        const clonedModule = {
            ...loaderModule,
            state: { ...loaderModule.state }
        };
        
        // Mock the actions to spy on commit calls
        const mockedActions = {
            [LOADER_FINISHED]: jest.fn(({ commit }) => commit(LOADER_FINISHED)),
            [LOADER_STARTED]: jest.fn(({ commit }) => commit(LOADER_STARTED))
        };
        
        clonedModule.actions = mockedActions;
        
        // Create a test store with just the loader module
        testStore = createStore({
            modules: {
                loader: clonedModule
            }
        });
        
        // Mock for direct action testing
        mockCommit = jest.fn();
    });
    
    describe('state', () => {
        it('defines the loading property', () => {
            expect(testStore.state.loader.loading).toEqual(false);
        });
    });

    describe('actions', () => {
        it('commits the finished action', async () => {
            await testStore.dispatch(LOADER_FINISHED);
            // Test direct mutation effect
            expect(testStore.state.loader.loading).toEqual(false);
        });

        it('commits the started action', async () => {
            await testStore.dispatch(LOADER_STARTED);
            // Test direct mutation effect
            expect(testStore.state.loader.loading).toEqual(true);
        });
        
        // Direct tests of action implementations to improve coverage
        it('calls commit with LOADER_FINISHED in finished action', () => {
            // Test the action implementation directly
            loaderModule.actions[LOADER_FINISHED]({ commit: mockCommit });
            expect(mockCommit).toHaveBeenCalledWith(LOADER_FINISHED);
        });
        
        it('calls commit with LOADER_STARTED in started action', () => {
            // Test the action implementation directly
            loaderModule.actions[LOADER_STARTED]({ commit: mockCommit });
            expect(mockCommit).toHaveBeenCalledWith(LOADER_STARTED);
        });
    });

    describe('mutations', () => {
        describe('finished', () => {
            it('sets the loading property to false', () => {
                testStore.state.loader.loading = true;
                testStore.commit(LOADER_FINISHED);
                expect(testStore.state.loader.loading).toEqual(false);
            });
        });
        
        describe('started', () => {
            it('sets the loading property to true', () => {
                testStore.state.loader.loading = false;
                testStore.commit(LOADER_STARTED);
                expect(testStore.state.loader.loading).toEqual(true);
            });
        });
    });
});
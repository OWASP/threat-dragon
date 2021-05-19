import { PROVIDER_CLEAR, PROVIDER_FETCH, PROVIDER_SELECTED } from '@/store/actions/provider.js';
import providerModule, { clearState } from '@/store/modules/provider.js';
import providerService from '@/service/provider/providers.js';

describe('store/modules/provider.js', () => {
    const mocks = {
        commit: () => {},
        dispatch: () => {}
    };

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
        jest.spyOn(mocks, 'dispatch');
    });

    afterEach(() => {
        clearState(providerModule.state);
    });

    describe('state', () => {
        it('defines an all array', () => {
            expect(providerModule.state.all).toBeInstanceOf(Array);
        });

        it('defines a selected string', () => {
            expect(providerModule.state.selected).toEqual('');
        });
    });

    describe('actions', () => {
        it('commits the clear action', () => {
            providerModule.actions[PROVIDER_CLEAR](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(PROVIDER_CLEAR);
        });
        
        describe('fetch', () => {
            beforeEach(() => {
                providerModule.actions[PROVIDER_FETCH](mocks);
            });

            it('dispatches the clear action', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(PROVIDER_CLEAR);
            });

            it('commits the fetch action will providerNames', () => {
                expect(mocks.commit).toHaveBeenCalledWith(
                    PROVIDER_FETCH,
                    Object.keys(providerService.providerNames)
                );
            });
        });
        
        describe('selected', () => {
            it('throws an error if providerName is falsy', () => {
                expect(() => providerModule.actions[PROVIDER_SELECTED](mocks)).toThrowError();
            });

            it('throws an error for an unknown provider', () => {
                expect(() => providerModule.actions[PROVIDER_SELECTED](mocks, 'fake')).toThrowError();
            });

            it('commits the selected provider', () => {
                providerModule.actions[PROVIDER_SELECTED](mocks, providerService.providerNames.github);
                expect(mocks.commit).toHaveBeenCalledWith(PROVIDER_SELECTED, providerService.providerNames.github);
            });
        });
    });

    describe('mutations', () => {
        describe('clear', () => {
            beforeEach(() => {
                providerModule.state.all.push('test1');
                providerModule.state.all.push('test2');
                providerModule.state.selected = 'github';
                providerModule.mutations[PROVIDER_CLEAR](providerModule.state);
            });

            it('empties the all array', () => {
                expect(providerModule.state.all.length).toEqual(0);
            });

            it('resets the selected property', () => {
                expect(providerModule.state.selected).toEqual('');
            });
        });

        describe('fetch', () => {
            const providerNames = Object.keys(providerService.providerNames);

            beforeEach(() => {
                providerModule.mutations[PROVIDER_FETCH](providerModule.state, providerNames);
            });

            it('sets the all array to the provided providers', () => {
                expect(providerModule.state.all).toEqual(providerNames);
            });
        });

        describe('selected', () => {
            const provider = 'test';

            beforeEach(() => {
                providerModule.mutations[PROVIDER_SELECTED](providerModule.state, provider);
            });

            it('sets the provider prop', () => {
                expect(providerModule.state.selected).toEqual(provider);
            });
        });
    });

    it('defines a getters object', () => {
        expect(providerModule.getters).toBeInstanceOf(Object);
    });
});

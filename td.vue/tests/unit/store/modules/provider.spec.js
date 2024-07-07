import { PROVIDER_CLEAR, PROVIDER_FETCH, PROVIDER_SELECTED } from '@/store/actions/provider.js';
import providerModule, { clearState } from '@/store/modules/provider.js';
import providerService from '@/service/provider/providers.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';

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

        it('defines a providerUri string', () => {
            expect(providerModule.state.providerUri).toEqual('');
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
            beforeEach(async () => {
                jest.spyOn(threatmodelApi, 'organisationAsync').mockResolvedValue(
                    { 
                        'protocol': 'https',
                        'hostname': 'github.com',
                        'port': ''
                    });
            });

            it('throws an error if providerName is falsy', async () => {
                await expect(() => providerModule.actions[PROVIDER_SELECTED](mocks)).rejects.toThrowError();
            });

            it('throws an error for an unknown provider', async () => {
                await expect(() => providerModule.actions[PROVIDER_SELECTED](mocks, 'fake')).rejects.toThrowError();
            });

            it('commits the selected provider', async () => {
                await providerModule.actions[PROVIDER_SELECTED](mocks, providerService.providerNames.github);
                expect(mocks.commit).toHaveBeenCalledWith(PROVIDER_SELECTED, 
                    { 
                        'providerName': providerService.providerNames.github, 
                        'providerUri': 'https://github.com' 
                    });
            });
        });
    });

    describe('mutations', () => {
        describe('clear', () => {
            beforeEach(() => {
                providerModule.state.all.push('test1');
                providerModule.state.all.push('test2');
                providerModule.state.selected = 'github';
                providerModule.state.providerUri = 'https://github.com';
                providerModule.mutations[PROVIDER_CLEAR](providerModule.state);
            });

            it('empties the all array', () => {
                expect(providerModule.state.all).toHaveLength(0);
            });

            it('resets the selected property', () => {
                expect(providerModule.state.selected).toEqual('');
            });

            it('resets the providerUri property', () => {
                expect(providerModule.state.providerUri).toEqual('');
            });
        });

        describe('selected', () => {
            const provider = 'test';
            const providerUri = 'https://github.com';

            beforeEach(() => {
                providerModule.mutations[PROVIDER_SELECTED](providerModule.state, {'providerName': provider, 'providerUri': providerUri});
            });

            it('sets the provider prop', () => {
                expect(providerModule.state.selected).toEqual(provider);
            });

            it('sets the providerUri prop', () => {
                expect(providerModule.state.providerUri).toEqual(providerUri);
            });
        });
    });

    it('defines a getters object', () => {
        expect(providerModule.getters).toBeInstanceOf(Object);
    });
});

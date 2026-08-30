import { providerClear, providerFetch, providerSelected } from '@/store/actions/provider.js';
import providerModule, { clearState } from '@/store/modules/provider.js';
import providerService from '@/service/provider/providers.js';
import { isDesktopApp } from '@/service/environment';
import threatmodelApi from '@/service/api/threatmodelApi.js';

jest.mock('@/service/environment', () => ({
    isDesktopApp: jest.fn()
}));

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
            providerModule.actions[providerClear](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(providerClear);
        });
        
        describe('fetch', () => {
            beforeEach(() => {
                providerModule.actions[providerFetch](mocks);
            });

            it('dispatches the clear action', () => {
                expect(mocks.dispatch).toHaveBeenCalledWith(providerClear);
            });

            it('commits the fetch action will providerNames', () => {
                expect(mocks.commit).toHaveBeenCalledWith(
                    providerFetch,
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
                await expect(() => providerModule.actions[providerSelected](mocks)).rejects.toThrowError();
            });

            it('throws an error for an unknown provider', async () => {
                await expect(() => providerModule.actions[providerSelected](mocks, 'fake')).rejects.toThrowError();
            });

            it('commits the selected provider', async () => {
                await providerModule.actions[providerSelected](mocks, providerService.providerNames.github);
                expect(mocks.commit).toHaveBeenCalledWith(providerSelected,
                    { 
                        'providerName': providerService.providerNames.github, 
                        'providerUri': 'https://github.com' 
                    });
            });

            it('commits the local provider', async () => {
                await providerModule.actions[providerSelected](mocks, providerService.providerNames.local);
                expect(mocks.commit).toHaveBeenCalledWith(providerSelected,
                    { 
                        'providerName': providerService.providerNames.local, 
                        'providerUri': 'threat-dragon-local' 
                    });
            });
        });

        describe('selected — desktop', () => {
            beforeEach(() => {
                isDesktopApp.mockReturnValue(true);
            });

            afterEach(() => {
                isDesktopApp.mockReturnValue(false);
            });

            it('commits desktop provider when providerName is desktop', async () => {
                await providerModule.actions[providerSelected](mocks, 'desktop');
                expect(mocks.commit).toHaveBeenCalledWith(providerSelected, {
                    providerName: 'desktop',
                    providerUri: 'threat-dragon-desktop'
                });
            });

            it('commits desktop provider when isDesktopApp() is true even for non-desktop provider', async () => {
                await providerModule.actions[providerSelected](mocks, 'local');
                expect(mocks.commit).toHaveBeenCalledWith(providerSelected, {
                    providerName: 'desktop',
                    providerUri: 'threat-dragon-desktop'
                });
            });
        });
    });

    describe('mutations', () => {
        describe('clear', () => {
            beforeEach(() => {
                providerModule.state.all.push('test1', 'test2');
                providerModule.state.selected = 'github';
                providerModule.state.providerUri = 'https://github.com';
                providerModule.mutations[providerClear](providerModule.state);
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

        describe('fetch', () => {
            const providers = ['foo', 'bar'];

            beforeEach(() => {
                providerModule.mutations[providerFetch](providerModule.state, providers);
            });

            it('sets the providers property', () => {
                expect(providerModule.state.all).toHaveLength(2);
                expect(providerModule.state.all[1]).toBe('bar');
            });
        });

        describe('selected', () => {
            const provider = 'test';
            const providerUri = 'https://github.com';

            beforeEach(() => {
                providerModule.mutations[providerSelected](providerModule.state, {'providerName': provider, 'providerUri': providerUri});
            });

            it('selects the provider', () => {
                expect(providerModule.state.selected).toEqual(provider);
            });

            it('sets the providerUri property', () => {
                expect(providerModule.state.providerUri).toEqual(providerUri);
            });
        });
    });

    it('defines a getters object', () => {
        expect(providerModule.getters).toBeInstanceOf(Object);
    });
});

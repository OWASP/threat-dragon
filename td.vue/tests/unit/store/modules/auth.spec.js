import providerModule from '@/store/modules/datasource.js';
import { DATASOURCE_PROVIDER_CLEAR, DATASOURCE_PROVIDER_SELECTED } from '../../../../src/store/actions/datasource.js';

describe('store/modules/datasource.js', () => {
    const mocks = {
        commit: () => {}
    };

    describe('state', () => {
        it('is an object', () => {
            expect(providerModule.state).toBeInstanceOf(Object);
        });

        it('has a provider property', () => {
            expect(providerModule.state.provider).not.toBeUndefined();
        });
    });

    describe('actions', () => {
        describe('selected', () => {
            it('is a function', () => {
                expect(providerModule.actions[DATASOURCE_PROVIDER_SELECTED]).toBeInstanceOf(Function);
            });

            it('commits the provider', () => {
                const provider = 'foobar';
                jest.spyOn(mocks, 'commit');
                providerModule.actions[DATASOURCE_PROVIDER_SELECTED](mocks, provider);
                expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_PROVIDER_SELECTED, provider);
            });
        });

        describe('clear', () => {
            it('is a function', () => {
                expect(providerModule.actions[DATASOURCE_PROVIDER_CLEAR]).toBeInstanceOf(Function);
            });

            it('commits PROVIDER_CLEAR', () => {
                jest.spyOn(mocks, 'commit');
                providerModule.actions[DATASOURCE_PROVIDER_CLEAR](mocks);
                expect(mocks.commit).toHaveBeenCalledWith(DATASOURCE_PROVIDER_CLEAR);
            });
        });
    });

    describe('mutations', () => {
        describe('clear', () => {
            it('resets state.provider', () => {
                providerModule.state.provider = 'foobar';
                providerModule.mutations[DATASOURCE_PROVIDER_CLEAR](providerModule.state);
                expect(providerModule.state.provider).toEqual('');
            });
        });

        describe('selected', () => {
            afterEach(() => {
                providerModule.state.provider = '';
            });

            it('throws an error if an unrecognized provider is used', () => {
                const fakeProvider = 'fake';
                expect(
                    () => providerModule.mutations[DATASOURCE_PROVIDER_SELECTED](providerModule.state, fakeProvider)
                ).toThrowError(`"${fakeProvider}" is not a recognized provider`);
            });

            it('sets the selected provider', () => {
                const provider = 'github';
                providerModule.mutations[DATASOURCE_PROVIDER_SELECTED](providerModule.state, provider);
                expect(providerModule.state.provider).toEqual(provider);
            });
        });
    });

    describe('getters', () => {
        it('is an object', () => {
            expect(providerModule.getters).toBeInstanceOf(Object);
        });
    });
});
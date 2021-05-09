import threatmodelModule from '@/store/modules/threatmodel.js';
import { THREATMODEL_FETCH } from '@/store/actions/threatmodel.js';

xdescribe('store/modules/threatmodel.js', () => {
    const mocks = {
        commit: () => {}
    };

    describe('state', () => {
        it('is an object', () => {
            expect(threatmodelModule.state).toBeInstanceOf(Object);
        });

        it('has a selected property', () => {
            expect(threatmodelModule.state.selected).not.toBeUndefined();
        });
    });

    describe('actions', () => {
        describe('fetch', () => {
                it('is a function', () => {
                    expect(threatmodelModule.actions[THREATMODEL_FETCH]).toBeInstanceOf(Function);
                });

                xit('Gets the threat model from the api', () => {});
    
                // TODO
                xit('commits the threatmodel', () => {
                    const tm = {};
                    jest.spyOn(mocks, 'commit');
                    threatmodelModule.actions[THREATMODEL_FETCH](mocks, provider);
                    expect(mocks.commit).toHaveBeenCalledWith(THREATMODEL_FETCH, tm);
                });
        });
    });

    describe('mutations', () => {
        describe('fetch', () => {
            it('sets the selected threat model', () => {
                const tm = { foo: '' };
                threatmodelModule.state.selected = {};
                threatmodelModule.mutations[THREATMODEL_FETCH](threatmodelModule.state, tm);
                expect(threatmodelModule.state.selected).toEqual(tm);
            });
        });
    });

    describe('getters', () => {
        it('is an object', () => {
            expect(threatmodelModule.getters).toBeInstanceOf(Object);
        });
    });
});
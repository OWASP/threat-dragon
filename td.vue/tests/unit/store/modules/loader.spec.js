import { LOADER_FINISHED, LOADER_STARTED } from '@/stores/actions/loader.js';
import loaderModule from '@/stores/loader.js';

describe('stores/modules/loader.js', () => {
    const mocks = {
        commit: () => {}
    };

    beforeEach(() => {
        jest.spyOn(mocks, 'commit');
    });

    afterEach(() => {
        loaderModule.state.loading = false;
    });

    describe('state', () => {
        it('defines the loading property', () => {
            expect(loaderModule.state.loading).toEqual(false);
        });
    });

    describe('actions', () => {
        it('commits the finished action', () => {
            loaderModule.actions[LOADER_FINISHED](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(LOADER_FINISHED);
        });

        it('commits the started action', () => {
            loaderModule.actions[LOADER_STARTED](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(LOADER_STARTED);
        });
    });

    describe('mutations', () => {

        describe('finished', () => {
            it('sets the loading property to false', () => {
                loaderModule.mutations[LOADER_FINISHED](loaderModule.state);
                expect(loaderModule.state.loading).toEqual(false);
            });
        });

        describe('started', () => {
            it('sets the loading property to true', () => {
                loaderModule.mutations[LOADER_STARTED](loaderModule.state);
                expect(loaderModule.state.loading).toEqual(true);
            });
        });
    });
});

import { loaderFinished, loaderStarted } from '@/store/actions/loader.js';
import loaderModule from '@/store/modules/loader.js';

describe('store/modules/loader.js', () => {
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
            loaderModule.actions[loaderFinished](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(loaderFinished);
        });

        it('commits the started action', () => {
            loaderModule.actions[loaderStarted](mocks);
            expect(mocks.commit).toHaveBeenCalledWith(loaderStarted);
        });
    });

    describe('mutations', () => {

        describe('finished', () => {
            it('sets the loading property to false', () => {
                loaderModule.mutations[loaderFinished](loaderModule.state);
                expect(loaderModule.state.loading).toEqual(false);
            });
        });
        
        describe('started', () => {
            it('sets the loading property to true', () => {
                loaderModule.mutations[loaderStarted](loaderModule.state);
                expect(loaderModule.state.loading).toEqual(true);
            });
        });
    });
});

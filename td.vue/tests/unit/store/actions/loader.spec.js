import { loaderFinished, loaderStarted } from '@/store/actions/loader.js';

describe('store/actions/loader.js', () => {
    it('defines the finished action', () => {
        expect(loaderFinished).not.toBeUndefined();
    });

    it('defines the started action', () => {
        expect(loaderStarted).not.toBeUndefined();
    });
});

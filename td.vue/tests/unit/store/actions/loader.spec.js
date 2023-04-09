import { LOADER_FINISHED, LOADER_STARTED } from '@/stores/actions/loader.js';

describe('stores/actions/loader.js', () => {
    it('defines the finished action', () => {
        expect(LOADER_FINISHED).not.toBeUndefined();
    });

    it('defines the started action', () => {
        expect(LOADER_STARTED).not.toBeUndefined();
    });
});

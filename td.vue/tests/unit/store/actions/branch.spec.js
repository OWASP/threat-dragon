import { branchClear, branchFetch, branchSelected } from '@/store/actions/branch.js';

describe('store/actions/branch.js', () => {
    it('defines a clear action', () => {
        expect(branchClear).not.toBeUndefined();
    });

    it('defines a fetch action', () => {
        expect(branchFetch).not.toBeUndefined();
    });

    it('defines a selected action', () => {
        expect(branchSelected).not.toBeUndefined();
    });
});

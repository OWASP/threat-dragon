import { THREATMODEL_FETCH } from '@/store/actions/threatmodel.js';

describe('store/actions/threatmodel.js', () => {
    it('defines a threatmodel fetch action', () => {
        expect(THREATMODEL_FETCH).not.toBeUndefined();
    });
});
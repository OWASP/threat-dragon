import { FOLDER_CLEAR, FOLDER_FETCH, FOLDER_SELECTED, FOLDER_NAVIGATE_BACK } from '@/store/actions/folder.js';

describe('store/actions/folder.js', () => {
    it('defines a clear action', () => {
        expect(FOLDER_CLEAR).not.toBeUndefined();
    });
    
    it('defines a fetch action', () => {
        expect(FOLDER_FETCH).not.toBeUndefined();
    });
    
    it('defines a selected action', () => {
        expect(FOLDER_SELECTED).not.toBeUndefined();
    });

    it('defines a navigate back action', () => {
        expect(FOLDER_NAVIGATE_BACK).not.toBeUndefined();
    });
});

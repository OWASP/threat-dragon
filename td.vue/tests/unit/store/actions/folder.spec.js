import { folderClear, folderFetch, folderSelected, folderNavigateBack } from '@/store/actions/folder.js';

describe('store/actions/folder.js', () => {
    it('defines a clear action', () => {
        expect(folderClear).not.toBeUndefined();
    });
    
    it('defines a fetch action', () => {
        expect(folderFetch).not.toBeUndefined();
    });
    
    it('defines a selected action', () => {
        expect(folderSelected).not.toBeUndefined();
    });

    it('defines a navigate back action', () => {
        expect(folderNavigateBack).not.toBeUndefined();
    });
});

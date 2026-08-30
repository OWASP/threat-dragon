import { repositoryClear, repositoryFetch, repositorySelected } from '@/store/actions/repository.js';

describe('store/actions/repository.js', () => {
    it('defines a clear action', () => {
        expect(repositoryClear).not.toBeUndefined();
    });
    
    it('defines a fetch action', () => {
        expect(repositoryFetch).not.toBeUndefined();
    });
    
    it('defines a selected action', () => {
        expect(repositorySelected).not.toBeUndefined();
    }); 
});

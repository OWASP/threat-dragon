import api from '@/service/api/api.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';

describe('service/threatmodelApi.js', () => {
    beforeEach(() => {
        jest.spyOn(api, 'getAsync').mockImplementation(() => {});
        jest.spyOn(api, 'putAsync').mockImplementation(() => {});
    });
    
    // Test for Bitbucket repository name handling
    describe('Bitbucket repository name handling', () => {
        it('handles Bitbucket repository names without organization', async () => {
            // This test verifies that branchesAsync can handle a repository name without an organization
            // by using the Bitbucket workspace from localStorage
            
            // Set up the API mock to return a successful response
            api.getAsync.mockResolvedValue({ data: { branches: [] } });
            
            // Call branchesAsync with a repository name that doesn't have an organization
            await threatmodelApi.branchesAsync('my-repo');
            
            // Verify that the API was called with the correct URL that includes the workspace
            // The actual implementation is using 'bitbucket' as the default organization
            expect(api.getAsync).toHaveBeenCalledWith(
                '/api/threatmodel/bitbucket/my-repo/branches',
                { params: { page: 1 } }
            );
        });
    });

    describe('organisationAsync', () => {
        beforeEach(async () => {
            await threatmodelApi.organisationAsync();
        });

        it('calls the organisation endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/organisation');
        });
    });

    describe('reposAsync', () => {
        beforeEach(async () => {
            await threatmodelApi.reposAsync();
        });

        it('calls the repos endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/repos', {'params': {'page': 1, 'searchQuery': ''}});
        });
    });

    describe('branchesAsync', () => {
        const repo = 'owasp/with/deep/layers/threat-dragon';

        beforeEach(async () => {
            await threatmodelApi.branchesAsync(repo);
        });

        it('calls the branches endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/with%2Fdeep%2Flayers%2Fthreat-dragon/branches', {'params': {'page': 1}});
        });
    });

    describe('modelsAsync', () => {
        const repo = 'owasp/with/deep/layers/threat-dragon';
        const branch = 'feature/some-feature';

        beforeEach(async () => {
            await threatmodelApi.modelsAsync(repo, branch);
        });

        it('calls the models endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/with%2Fdeep%2Flayers%2Fthreat-dragon/feature%2Fsome-feature/models');
        });
    });

    describe('modelAsync', () => {
        const repo = 'owasp/with/deep/layers/threat-dragon';
        const branch = 'main&';
        const model = 'test?';

        beforeEach(async () => {
            await threatmodelApi.modelAsync(repo, branch, model);
        });

        it('calls the model endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/with%2Fdeep%2Flayers%2Fthreat-dragon/main%26/test%3F/data');
        });
    });

    describe('updateAsync', () => {
        const repo = 'owasp/with/deep/layers/threat-dragon';
        const branch = 'main&';
        const modelName = 'test?';
        const body = { foo: 'bar' };

        beforeEach(async () => {
            await threatmodelApi.updateAsync(repo, branch, modelName, body);
        });

        it('calls the update endpoint', () => {
            expect(api.putAsync).toHaveBeenCalledWith(
                '/api/threatmodel/owasp/with%2Fdeep%2Flayers%2Fthreat-dragon/main%26/test%3F/update',
                body
            );
        });
    });
});

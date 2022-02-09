import api from '@/service/api.js';
import threatmodelApi from '@/service/threatmodelApi.js';

describe('service/threatmodelApi.js', () => {
    beforeEach(() => {
        jest.spyOn(api, 'getAsync').mockImplementation(() => {});
    });

    describe('reposAsync', () => {
        beforeEach(async () => {
            await threatmodelApi.reposAsync();
        });

        it('calls the repos endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/repos');
        });
    });

    describe('branchesAsync', () => {
        const repo = 'owasp/threat-dragon';

        beforeEach(async () => {
            await threatmodelApi.branchesAsync(repo);
        });

        it('calls the branches endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/threat-dragon/branches');
        });
    });

    describe('modelsAsync', () => {
        const repo = 'owasp/threat-dragon';
        const branch = 'feature/some-feature';

        beforeEach(async () => {
            await threatmodelApi.modelsAsync(repo, branch);
        });

        it('calls the models endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/threat-dragon/feature%2Fsome-feature/models');
        });
    });

    describe('modelAsync', () => {
        const repo = 'owasp/threat-dragon';
        const branch = 'main';
        const model = 'test';

        beforeEach(async () => {
            await threatmodelApi.modelAsync(repo, branch, model);
        });

        it('calls the model endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/threat-dragon/main/test/data');
        });
    });
});

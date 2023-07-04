import api from '@/service/api/api.js';
import threatmodelApi from '@/service/api/threatmodelApi.js';

describe('service/threatmodelApi.js', () => {
    beforeEach(() => {
        jest.spyOn(api, 'getAsync').mockImplementation(() => {});
        jest.spyOn(api, 'putAsync').mockImplementation(() => {});
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
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/repos', {"params": {"page": 1}});
        });
    });

    describe('branchesAsync', () => {
        const repo = 'owasp/threat-dragon';

        beforeEach(async () => {
            await threatmodelApi.branchesAsync(repo);
        });

        it('calls the branches endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/threat-dragon/branches', {"params": {"page": 1}});
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

    describe('updateAsync', () => {
        const repo = 'owasp/threat-dragon';
        const branch = 'main';
        const modelName = 'test';
        const body = { foo: 'bar' };

        beforeEach(async () => {
            await threatmodelApi.updateAsync(repo, branch, modelName, body);
        });

        it('calls the update endpoint', () => {
            expect(api.putAsync).toHaveBeenCalledWith(
                '/api/threatmodel/owasp/threat-dragon/main/test/update',
                body
            );
        });
    });
});

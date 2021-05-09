import api from '@/service/api.js';
import threatmodelApi from '@/service/threatmodelApi.js';

describe('service/threatmodelApi.js', () => {
    const token = 'myjwt';

    beforeEach(() => {
        jest.spyOn(api, 'getAsync').mockImplementation(() => {});
    });

    describe('reposAsync', () => {
        beforeEach(async () => {
            await threatmodelApi.reposAsync(token);
        });

        it('calls the repos endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/repos', expect.anything());
        });

        it('uses the bearer token', () => {
            expect(api.getAsync).toHaveBeenCalledWith(expect.anything(), token);
        });
    });

    describe('branchesAsync', () => {
        const repo = 'owasp/threat-dragon';

        beforeEach(async () => {
            await threatmodelApi.branchesAsync(repo, token);
        });

        it('calls the branches endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/threat-dragon/branches', expect.anything());
        });

        it('uses the bearer token', () => {
            expect(api.getAsync).toHaveBeenCalledWith(expect.anything(), token);
        });
    });

    describe('modelsAsync', () => {
        const repo = 'owasp/threat-dragon';
        const branch = 'main';

        beforeEach(async () => {
            await threatmodelApi.modelsAsync(repo, branch, token);
        });

        it('calls the models endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/threat-dragon/main/models', expect.anything());
        });

        it('uses the bearer token', () => {
            expect(api.getAsync).toHaveBeenCalledWith(expect.anything(), token);
        });
    });

    describe('modelAsync', () => {
        const repo = 'owasp/threat-dragon';
        const branch = 'main';
        const model = 'test';

        beforeEach(async () => {
            await threatmodelApi.modelAsync(repo, branch, model, token);
        });

        it('calls the model endpoint', () => {
            expect(api.getAsync).toHaveBeenCalledWith('/api/threatmodel/owasp/threat-dragon/main/test/data', expect.anything());
        });

        it('uses the bearer token', () => {
            expect(api.getAsync).toHaveBeenCalledWith(expect.anything(), token);
        });
    });
});

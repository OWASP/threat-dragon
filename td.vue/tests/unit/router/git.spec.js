import { gitRoutes } from '@/router/git.js';

describe('routes/git.js', () => {
    describe('Repository access', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitRepository');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/repository');
        });

        it('uses the RepositoryAccess view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('RepositoryAccess');
        });
    });

    describe('Repository branch access', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitBranch');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/:repository/branch');
        });

        it('uses the BranchAccess view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('BranchAccess');
        });
    });

    describe('Threat model select', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitThreatModelSelect');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/:repository/:branch/threatmodels');
        });

        it('uses the ThreatModelSelect view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModelSelect');
        });
    });

    describe('New threat model', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitNewThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/:repository/:branch/new');
        });

        it('uses the NewThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('NewThreatModel');
        });
    });

    describe('Threat model', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/:repository/:branch/:threatmodel');
        });

        it('uses the ThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModel');
        });
    });

    describe('Threat model edit', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitThreatModelEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/:repository/:branch/:threatmodel/edit');
        });

        it('uses the ThreatModelEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModelEdit');
        });
    });

    describe('DiagramEdit', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitDiagramEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/:repository/:branch/:threatmodel/edit/:diagram');
        });

        it('uses the DiagramEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('DiagramEdit');
        });
    });

    describe('Report model', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitReport');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/:repository/:branch/:threatmodel/report');
        });

        it('uses the ReportModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ReportModel');
        });
    });

});

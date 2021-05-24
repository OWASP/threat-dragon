import { gitRoutes } from '@/router/git.js';

describe('routes/git.js', () => {
    describe('Repository', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitRepository');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/repository');
        });

        it('uses the Repository view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('Repository');
        });
    });

    describe('Branch', () => {
        let route;

        beforeEach(() => {
            route = gitRoutes
                .find(x => x.name === 'gitBranch');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/git/:provider/:repository/branch');
        });

        it('uses the Branch view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('Branch');
        });
    });

    describe('ThreatModelSelect', () => {
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

    describe('ThreatModel', () => {
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

    describe('ThreatModelEdit', () => {
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

        it('uses the Diagram view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('Diagram');
        });
    });
});
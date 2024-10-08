import { googleRoutes } from '@/router/google.js';

describe('routes/google.js', () => {
    describe('Drive folder access', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleFolder');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/google/:provider/folder');
        });

        it('uses the DriveAccess view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('DriveAccess');
        });
    });

    describe('Threat model access', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/google/:provider/:folder/:threatmodel');
        });

        it('uses the ThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModel');
        });
    });

    describe('New threat model creation', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleNewThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/google/:provider/:folder/new');
        });

        it('uses the NewThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('NewThreatModel');
        });
    });

    describe('Threat model edit', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleThreatModelEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/google/:provider/:folder/:threatmodel/edit');
        });

        it('uses the ThreatModelEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModelEdit');
        });
    });

    describe('Diagram edit', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleDiagramEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/google/:provider/:folder/:threatmodel/edit/:diagram');
        });

        it('uses the DiagramEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('DiagramEdit');
        });
    });

    describe('Threat model report', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleReport');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/google/:provider/:folder/:threatmodel/report');
        });

        it('uses the ReportModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ReportModel');
        });
    });
});

import { localRoutes } from '@/router/local.js';

describe('routes/local.js', () => {
    describe('Threat model', () => {
        let route;

        beforeEach(() => {
            route = localRoutes
                .find(x => x.name === 'localThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/local/:threatmodel');
        });

        it('uses the ThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModel');
        });
    });

    describe('Threat model edit', () => {
        let route;

        beforeEach(() => {
            route = localRoutes
                .find(x => x.name === 'localThreatModelEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/local/:threatmodel/edit');
        });

        it('uses the ThreatModelEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModelEdit');
        });
    });

    describe('Diagram edit', () => {
        let route;

        beforeEach(() => {
            route = localRoutes
                .find(x => x.name === 'localDiagramEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/local/:threatmodel/edit/:diagram');
        });

        it('uses the DiagramEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('DiagramEdit');
        });
    });


    describe('New threat model', () => {
        let route;

        beforeEach(() => {
            route = localRoutes
                .find(x => x.name === 'localNewThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/local/threatmodel/new');
        });

        it('uses the NewThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('NewThreatModel');
        });
    });

    describe('Threat model import', () => {
        let route;

        beforeEach(() => {
            route = localRoutes
                .find(x => x.name === 'localThreatModelImport');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/local/threatmodel/import');
        });

        it('uses the ImportModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ImportModel');
        });
    });

    describe('Report model', () => {
        let route;

        beforeEach(() => {
            route = localRoutes
                .find(x => x.name === 'localReport');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/local/:threatmodel/report');
        });

        it('uses the ReportModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ReportModel');
        });
    });
    
});

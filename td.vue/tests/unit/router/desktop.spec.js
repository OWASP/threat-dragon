import { desktopRoutes } from '@/router/desktop.js';

describe('routes/desktop.js', () => {
    describe('Threat model', () => {
        let route;

        beforeEach(() => {
            route = desktopRoutes
                .find(x => x.name === 'desktopThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/desktop/:threatmodel');
        });

        it('uses the ThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModel');
        });
    });

    describe('Threat model edit', () => {
        let route;

        beforeEach(() => {
            route = desktopRoutes
                .find(x => x.name === 'desktopThreatModelEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/desktop/:threatmodel/edit');
        });

        it('uses the ThreatModelEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ThreatModelEdit');
        });
    });

    describe('Diagram edit', () => {
        let route;

        beforeEach(() => {
            route = desktopRoutes
                .find(x => x.name === 'desktopDiagramEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/desktop/:threatmodel/edit/:diagram');
        });

        it('uses the DiagramEdit view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('DiagramEdit');
        });
    });


    describe('New threat model', () => {
        let route;

        beforeEach(() => {
            route = desktopRoutes
                .find(x => x.name === 'desktopNewThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/desktop/threatmodel/new');
        });

        it('uses the NewThreatModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('NewThreatModel');
        });
    });

    describe('Threat model import', () => {
        let route;

        beforeEach(() => {
            route = desktopRoutes
                .find(x => x.name === 'desktopThreatModelImport');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/desktop/threatmodel/import');
        });

        it('uses the ImportModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ImportModel');
        });
    });

    describe('Report model', () => {
        let route;

        beforeEach(() => {
            route = desktopRoutes
                .find(x => x.name === 'desktopReport');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/desktop/:threatmodel/report');
        });

        it('uses the ReportModel view as a lazily loaded component', async () => {
            const cmp = await route.component();
            expect(cmp.default.name).toEqual('ReportModel');
        });
    });

});

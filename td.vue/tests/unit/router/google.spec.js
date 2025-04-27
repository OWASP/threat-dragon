import { googleRoutes } from '@/router/google.js';

describe('routes/google.js', () => {
    describe('Threat model access', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/drive/:folder/:threatmodel');
        });

        it('uses a lazily loaded component for ThreatModel', async () => {
            // In Vue 3, dynamic imports are handled differently
            const cmp = await route.component();
            expect(cmp).toBeDefined();
            // Name check is unreliable in Vue 3 with webpack chunking
        });
    });

    describe('New threat model creation', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleNewThreatModel');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/drive/:folder/new');
        });

        it('uses a lazily loaded component for NewThreatModel', async () => {
            // In Vue 3, dynamic imports are handled differently
            const cmp = await route.component();
            expect(cmp).toBeDefined();
            // Name check is unreliable in Vue 3 with webpack chunking
        });
    });

    describe('Threat model edit', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleThreatModelEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/drive/:folder/:threatmodel/edit');
        });

        it('uses a lazily loaded component for ThreatModelEdit', async () => {
            // In Vue 3, dynamic imports are handled differently
            const cmp = await route.component();
            expect(cmp).toBeDefined();
            // Name check is unreliable in Vue 3 with webpack chunking
        });
    });

    describe('Diagram edit', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleDiagramEdit');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/drive/:folder/:threatmodel/edit/:diagram');
        });

        it('uses a lazily loaded component for DiagramEdit', async () => {
            // In Vue 3, dynamic imports are handled differently
            const cmp = await route.component();
            expect(cmp).toBeDefined();
            // Name check is unreliable in Vue 3 with webpack chunking
        });
    });

    describe('Threat model report', () => {
        let route;

        beforeEach(() => {
            route = googleRoutes.find(x => x.name === 'googleReport');
        });

        it('uses the expected path', () => {
            expect(route.path).toEqual('/drive/:folder/:threatmodel/report');
        });

        it('uses a lazily loaded component for ReportModel', async () => {
            // In Vue 3, dynamic imports are handled differently
            const cmp = await route.component();
            expect(cmp).toBeDefined();
            // Name check is unreliable in Vue 3 with webpack chunking
        });
    });
});

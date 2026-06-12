import tmBom from '@/service/migration/tmBom/tmBom';

import demoModel from '@/service/demo/v2-threat-model.json';
import newModel from '@/service/demo/v2-new-model.json';
import tdModel from './td-test-model';

describe('service/migration/tmBom/tmBom.exportAsTmbom', () => {

    describe('export/convert new model', () => {
        const testModel = tmBom.exportAsTmbom(newModel);

        it('provides meta-data', () => {
            expect(testModel.$schema).toContain('threat-model.schema.json');
            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
        });

        it('provides scope values', () => {
            expect(testModel.scope.title.length).toBeGreaterThan(1);
            expect(testModel.scope.description.length).toBeGreaterThan(1);
            expect(testModel.scope.business_criticality.length).toBeGreaterThan(1);
            expect(testModel.scope.data_sensitivity.length).toBeGreaterThanOrEqual(1);
            expect(testModel.scope.exposure.length).toBeGreaterThan(1);
            expect(testModel.scope.tier.length).toBeGreaterThan(1);
        });

        it('provides no diagrams', () => {
            expect(testModel.diagrams).toHaveLength(0);
        });

        it('provides no trust zones nor boundaries', () => {
            expect(testModel.trust_zones).toHaveLength(0);
            expect(testModel.trust_boundaries).toHaveLength(0);
        });

        it('provides no actors', () => {
            expect(testModel.actors).toHaveLength(0);
        });

        it('provides no components', () => {
            expect(testModel.components).toHaveLength(0);
        });

        it('provides no data stores nor sets', () => {
            expect(testModel.data_stores).toHaveLength(0);
            expect(testModel.data_sets).toHaveLength(0);
        });

        it('provides no data flows', () => {
            expect(testModel.data_flows).toHaveLength(0);
        });

        it('provides no threats, controls or risks', () => {
            expect(testModel.threat_personas).toHaveLength(1);
            expect(testModel.threats).toHaveLength(0);
            expect(testModel.controls).toHaveLength(0);
            expect(testModel.risks).toHaveLength(0);
        });
    });

    describe('export/convert test model', () => {
        const testModel = tmBom.exportAsTmbom(tdModel);

        it('provides meta-data', () => {
            expect(testModel.$schema).toContain('threat-model.schema.json');
            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
        });

        it('provides scope values', () => {
            expect(testModel.scope.title.length).toBeGreaterThan(1);
            expect(testModel.scope.description.length).toBeGreaterThan(1);
            expect(testModel.scope.business_criticality.length).toBeGreaterThan(1);
            expect(testModel.scope.data_sensitivity.length).toBeGreaterThanOrEqual(1);
            expect(testModel.scope.exposure.length).toBeGreaterThan(1);
            expect(testModel.scope.tier.length).toBeGreaterThan(1);
        });

        it('provides diagrams', () => {
            expect(testModel.diagrams).toHaveLength(1);
        });

        it('provides trust zones and not boundaries', () => {
            expect(testModel.trust_zones.length).toBeGreaterThanOrEqual(4);
            expect(testModel.trust_boundaries).toHaveLength(0);
        });

        it('provides actors', () => {
            expect(testModel.actors.length).toBeGreaterThanOrEqual(4);
        });

        it('provides components', () => {
            expect(testModel.components.length).toBeGreaterThanOrEqual(4);
        });

        it('provides data stores and not sets', () => {
            expect(testModel.data_stores.length).toBeGreaterThanOrEqual(4);
            expect(testModel.data_sets).toHaveLength(0);
        });

        it('provides data flows', () => {
            expect(testModel.data_flows.length).toBeGreaterThanOrEqual(4);
        });

        it('provides threats, controls and risks', () => {
            expect(testModel.threat_personas).toHaveLength(1);
            expect(testModel.threats.length).toBeGreaterThanOrEqual(4);
            expect(testModel.controls.length).toBeGreaterThanOrEqual(4);
            expect(testModel.risks.length).toBeGreaterThanOrEqual(4);
        });
    });

    describe('export/convert demo model', () => {
        const testModel = tmBom.exportAsTmbom(demoModel);

        it('provides meta-data', () => {
            expect(testModel.$schema).toContain('threat-model.schema.json');
            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
        });

        it('provides scope values', () => {
            expect(testModel.scope.title.length).toBeGreaterThan(1);
            expect(testModel.scope.description.length).toBeGreaterThan(1);
            expect(testModel.scope.business_criticality.length).toBeGreaterThan(1);
            expect(testModel.scope.data_sensitivity.length).toBeGreaterThanOrEqual(1);
            expect(testModel.scope.exposure.length).toBeGreaterThan(1);
            expect(testModel.scope.tier.length).toBeGreaterThan(1);
        });

        it('provides no diagrams', () => {
            expect(testModel.diagrams).toHaveLength(0);
        });

        it('provides trust zones and not boundaries', () => {
            expect(testModel.trust_zones.length).toBeGreaterThanOrEqual(3);
            expect(testModel.trust_boundaries).toHaveLength(0);
        });

        it('provides actors', () => {
            expect(testModel.actors.length).toBeGreaterThanOrEqual(1);
        });

        it('provides components', () => {
            expect(testModel.components.length).toBeGreaterThanOrEqual(2);
        });

        it('provides data stores and not sets', () => {
            expect(testModel.data_stores.length).toBeGreaterThanOrEqual(4);
            expect(testModel.data_sets).toHaveLength(0);
        });

        it('provides data flows', () => {
            expect(testModel.data_flows.length).toBeGreaterThanOrEqual(4);
        });

        it('provides threats, controls and risks', () => {
            expect(testModel.threat_personas).toHaveLength(1);
            expect(testModel.threats.length).toBeGreaterThanOrEqual(4);
            expect(testModel.controls.length).toBeGreaterThanOrEqual(4);
            expect(testModel.risks.length).toBeGreaterThanOrEqual(4);
        });
    });
});

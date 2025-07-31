import tmBom from '@/service/migration/tmBom/tmBom';
import tmBomModel from './test-model';
import tdModel from './v2-threat-model';

describe('service/migration/tmBom/tmBom.js', () => {
    let testModel;

    describe('read: import TM-BOM model', () => {
        beforeEach(() => {
            testModel = tmBom.read(tmBomModel);
        });

        it('provides version', () => {
            console.debug(JSON.stringify(testModel));
            expect(testModel.version).toBe('2.4.1');
        });

        it('stores the compatibility values', () => {
            expect(testModel.compatibility.version).toBe(tmBomModel.version);
            expect(testModel.compatibility.frozen).toBe(tmBomModel.frozen);
            expect(testModel.compatibility.release_docs_link).toBe(tmBomModel.release_docs_link);
            expect(testModel.compatibility.reviewed_at).toBe(tmBomModel.reviewed_at);
            expect(testModel.compatibility.repo_link).toBe(tmBomModel.repo_link);
        });
    });

    describe('version', () => {
        let version;
        beforeEach(() => {
            version = tmBom.version;
        });

        it('reports the version', () => {
            expect(version).toBe('2.4.1');
        });
    });

    describe('write: export TM-BOM model', () => {
        beforeEach(() => {
            testModel = tmBom.write(tdModel);
        });

        it('provides version', () => {
            expect(testModel.version).toBe(tdModel.compatibility.version);
        });

        it('reinstates the compatibility values', () => {
            expect(testModel.frozen).toBe(tdModel.compatibility.frozen);
            expect(testModel.release_docs_link).toBe(tdModel.compatibility.release_docs_link);
            expect(testModel.reviewed_at).toBe(tdModel.compatibility.reviewed_at);
            expect(testModel.repo_link).toBe(tdModel.compatibility.repo_link);
        });
    });

});

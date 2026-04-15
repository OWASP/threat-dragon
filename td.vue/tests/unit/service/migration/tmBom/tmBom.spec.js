import tmBom from '@/service/migration/tmBom/tmBom';
import tmBomModel from './test-model';
import tdModel from './v2-threat-model';

describe('service/migration/tmBom/tmBom.js', () => {

    describe('read', () => {
        let testModel;

        describe('import TM-BOM model', () => {
	        beforeEach(() => {
	            testModel = tmBom.read(tmBomModel);
	        });
	
	        it('provides version', () => {
	            console.debug(JSON.stringify(testModel));
	            expect(testModel.version.length).toBeGreaterThanOrEqual(5);
	        });
	
	        it('stores the required compatibility values', () => {
	            expect(testModel.compatibility.version).toBe(tmBomModel.version);
	            expect(testModel.compatibility.description).toBe(tmBomModel.description);
	        });
	
	        it('stores the compatibility values', () => {
	            expect(testModel.compatibility.version).toBe(tmBomModel.version);
	            expect(testModel.compatibility.frozen).toBe(tmBomModel.frozen);
	            expect(testModel.compatibility.release_docs_link).toBe(tmBomModel.release_docs_link);
	            expect(testModel.compatibility.reviewed_at).toBe(tmBomModel.reviewed_at);
	            expect(testModel.compatibility.repo_link).toBe(tmBomModel.repo_link);
	        });
        });

        describe('handles missing TM-BOM objects', () => {
		    it('skips absent optional values', () => {
		        let noOptionsModel = JSON.parse(JSON.stringify(tmBomModel));
                delete noOptionsModel.frozen;
                delete noOptionsModel.repo_link;
		        testModel = tmBom.read(noOptionsModel);
                expect(testModel.compatibility.frozen).toBeUndefined();
                expect(testModel.compatibility.release_docs_link).toBe(tmBomModel.release_docs_link);
                expect(testModel.compatibility.reviewed_at).toBe(tmBomModel.reviewed_at);
                expect(testModel.compatibility.repo_link).toBeUndefined();
		    });
        });
    });

    describe('version', () => {
        it('reports the schema version', () => {
            expect(tmBom.version.length).toBeGreaterThanOrEqual(5);
        });
    });

    describe('write', () => {
        let testModel;

        describe('export TM-BOM model', () => {
	        beforeEach(() => {
	            testModel = tmBom.write(tdModel);
	        });
	
	        it('provides mandatory values', () => {
                expect(testModel.version).toBe(tdModel.compatibility.version);
                expect(testModel.description).toBe(tdModel.compatibility.description);
	        });
	
	        it('reinstates the compatibility values', () => {
	            expect(testModel.frozen).toBe(tdModel.compatibility.frozen);
	            expect(testModel.release_docs_link).toBe(tdModel.compatibility.release_docs_link);
	            expect(testModel.reviewed_at).toBe(tdModel.compatibility.reviewed_at);
	            expect(testModel.repo_link).toBe(tdModel.compatibility.repo_link);
	        });
	    });

        describe('handles missing TM-BOM objects', () => {
		    it('defaults absent required values', () => {
		        let noCompatibilityModel = JSON.parse(JSON.stringify(tdModel));
		        delete noCompatibilityModel.compatibility;
		        testModel = tmBom.write(noCompatibilityModel);
		        expect(testModel.version.length).toBeGreaterThanOrEqual(5);
		        expect(testModel.description.length).toBeGreaterThan(1);
		    });

		    it('defaults absent optional values', () => {
		        let noOptionsModel = JSON.parse(JSON.stringify(tdModel));
		        delete noOptionsModel.compatibility.frozen;
		        delete noOptionsModel.compatibility.repo_link;
		        testModel = tmBom.write(noOptionsModel);
		        expect(testModel.frozen).toBeUndefined();
		        expect(testModel.release_docs_link).toBe(tmBomModel.release_docs_link);
		        expect(testModel.reviewed_at).toBe(tmBomModel.reviewed_at);
		        expect(testModel.repo_link).toBeUndefined();
		    });
        });
    });

});

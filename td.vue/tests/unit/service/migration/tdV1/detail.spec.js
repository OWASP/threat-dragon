import detail from '@/service/migration/tdV1/detail';
import v1Model from './v1-threat-model';

const emtpyV1Detail = {'detail': {'contributors': [],'diagrams': []}};
const testVersion = 'testVersion';

describe('service/migration/tdV1/detail.js', () => {
    let v2Detail;
    let v1NoDiagramModel = JSON.parse(JSON.stringify(v1Model));
    delete v1NoDiagramModel.detail.diagrams;

    describe('reads version 1 model', () => {
        beforeEach(() => {
            v2Detail = detail.read(v1Model.detail, testVersion);
        });

        it('converts the contributors', () => {
            expect(v2Detail.contributors).toHaveLength(2);
            expect(v2Detail.contributors[0]).toStrictEqual({'name':'test contributor 1'});
            expect(v2Detail.contributors[1]).toStrictEqual({'name':'test contributor 2'});
        });

        it('converts the diagrams', () => {
		    expect(v2Detail.diagrams).toHaveLength(2);
            expect(v2Detail.diagrams[0].version).toEqual(testVersion);
            expect(v2Detail.diagrams[1].version).toEqual(testVersion);
        });

        it('creates the diagramTop value', () => {
            expect(v2Detail.diagramTop).toBe(2);
        });

        it('copies the reviewer', () => {
            expect(v2Detail.reviewer).toMatch(/^test reviewer/);
        });

        it('creates the threatTop value', () => {
            expect(v2Detail.threatTop).toBe(1000);
        });
    });
	
    describe('reads model with no diagrams', () => {
        beforeEach(() => {
            v2Detail = detail.read(v1NoDiagramModel.detail, testVersion);			
        });

        it('converts the contributors', () => {
            expect(v2Detail.contributors).toHaveLength(2);
        });

        it('converts no diagrams', () => {
		    expect(v2Detail.diagrams).toHaveLength(0);
        });

        it('creates default diagramTop value', () => {
            expect(v2Detail.diagramTop).toBe(0);
        });

        it('copies the reviewer', () => {
            expect(v2Detail.reviewer).toMatch(/^test reviewer/);
        });

        it('creates the threatTop value', () => {
            expect(v2Detail.threatTop).toBe(1000);
        });
    });

    describe('reads empty version 1 model', () => {
	    beforeEach(() => {
	        v2Detail = detail.read(emtpyV1Detail);
	    });

	    it('provides empty contributors', () => {
	        expect(v2Detail.contributors).toHaveLength(0);
        });

        it('converts no diagrams', () => {
		    expect(v2Detail.diagrams).toHaveLength(0);
        });

        it('creates default diagramTop value', () => {
		    expect(v2Detail.diagramTop).toBe(0);
        });

        it('provides empty reviewer', () => {
		    expect(v2Detail.reviewer).toEqual('');
        });

        it('creates the threatTop value', () => {
		    expect(v2Detail.threatTop).toBe(1000);
	    });
    });
});

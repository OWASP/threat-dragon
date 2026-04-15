import detail from '@/service/migration/tmBom/detail';
import tmBomModel from './test-model';

describe('service/migration/tmBom/detail.js', () => {
    let testDetail;

    describe('import TM-BOM diagram details', () => {

        it('provides detail', () => {
            testDetail = detail.read(tmBomModel);
            expect(testDetail.contributors).toHaveLength(1);
            expect(testDetail.diagramTop).toBe(1);
            expect(testDetail.reviewer).toBe('');
            expect(testDetail.threatTop).toBe(8);

        });

        it('handles empty diagrams', () => {
            let noDiagramsModel = JSON.parse(JSON.stringify(tmBomModel));
            delete noDiagramsModel.diagrams;
            testDetail = detail.read(noDiagramsModel);
		    expect(testDetail.diagramTop).toBe(0);
        });

        it('handles empty threats', () => {
		    let emptyThreatsModel = JSON.parse(JSON.stringify(tmBomModel));
		    emptyThreatsModel.threats = [];
		    testDetail = detail.read(emptyThreatsModel);
		    expect(testDetail.threatTop).toBe(0);
        });

        it('handles missing threats', () => {
		    let noThreatsModel = JSON.parse(JSON.stringify(tmBomModel));
		    delete noThreatsModel.threats;
		    testDetail = detail.read(noThreatsModel);
		    expect(testDetail.threatTop).toBe(0);
        });
    });
});

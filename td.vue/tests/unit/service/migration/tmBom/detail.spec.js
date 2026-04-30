import diagrams from '@/service/migration/tmBom/diagrams/diagrams';
import detail from '@/service/migration/tmBom/detail';

import tmBomModel from './test-model';

jest.mock('@/service/migration/tmBom/diagrams/diagrams');

describe('service/migration/tmBom/detail.js', () => {
    let testDetail;
    const testDiagrams = [{title: 'test title0'}, {title: 'test title1'}];

    describe('import TM-BOM diagram details', () => {

        it('provides detail', () => {
            diagrams.merge.mockReturnValue(testDiagrams);
            testDetail = detail.merge(tmBomModel);
            expect(testDetail.contributors).toHaveLength(1);
            expect(testDetail.diagramTop).toBe(tmBomModel.diagrams.length + 1);
            expect(testDetail.reviewer).toBe('');
            expect(testDetail.threatTop).toBe(tmBomModel.threats.length - 1);

        });

        it('handles empty diagrams', () => {
            diagrams.merge.mockReturnValue([]);
            testDetail = detail.merge(tmBomModel);
		    expect(testDetail.diagramTop).toBe(0);
        });

        it('handles empty threats', () => {
		    let emptyThreatsModel = JSON.parse(JSON.stringify(tmBomModel));
		    emptyThreatsModel.threats = [];
            diagrams.merge.mockReturnValue(testDiagrams);
		    testDetail = detail.merge(emptyThreatsModel);
		    expect(testDetail.threatTop).toBe(0);
        });

        it('handles missing threats', () => {
		    let noThreatsModel = JSON.parse(JSON.stringify(tmBomModel));
		    delete noThreatsModel.threats;
            diagrams.merge.mockReturnValue(testDiagrams);
		    testDetail = detail.merge(noThreatsModel);
		    expect(testDetail.threatTop).toBe(0);
        });
    });
});

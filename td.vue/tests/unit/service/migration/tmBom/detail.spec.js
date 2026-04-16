import diagrams from '@/service/migration/tmBom/diagrams/diagrams';
import detail from '@/service/migration/tmBom/detail';

import tmBomModel from './test-model';

jest.mock('@/service/migration/tmBom/diagrams/diagrams');

describe('service/migration/tmBom/detail.js', () => {
    let testDetail;
    const testDiagrams = [{title: 'test title0'}, {title: 'test title1'}];

    describe('import TM-BOM diagram details', () => {

        it('provides detail', () => {
            diagrams.read.mockReturnValue(testDiagrams);
            testDetail = detail.read(tmBomModel);
            expect(testDetail.contributors).toHaveLength(1);
            expect(testDetail.diagramTop).toBe(2);
            expect(testDetail.reviewer).toBe('');
            expect(testDetail.threatTop).toBe(8);

        });

        it('handles empty diagrams', () => {
            diagrams.read.mockReturnValue([]);
            testDetail = detail.read(tmBomModel);
		    expect(testDetail.diagramTop).toBe(0);
        });

        it('handles empty threats', () => {
		    let emptyThreatsModel = JSON.parse(JSON.stringify(tmBomModel));
		    emptyThreatsModel.threats = [];
            diagrams.read.mockReturnValue(testDiagrams);
		    testDetail = detail.read(emptyThreatsModel);
		    expect(testDetail.threatTop).toBe(0);
        });

        it('handles missing threats', () => {
		    let noThreatsModel = JSON.parse(JSON.stringify(tmBomModel));
		    delete noThreatsModel.threats;
            diagrams.read.mockReturnValue(testDiagrams);
		    testDetail = detail.read(noThreatsModel);
		    expect(testDetail.threatTop).toBe(0);
        });
    });
});

import detail from '@/service/migration/tmBom/detail';
import tmBomModel from './test-model';

describe('service/migration/tmBom/detail.js', () => {
    let testDetail;

    describe('import TM-BOM diagram details', () => {
        beforeEach(() => {
            testDetail = detail.read(tmBomModel);
        });

        it('provides detail', () => {
            expect(testDetail.contributors).toHaveLength(1);
            expect(testDetail.diagramTop).toBe(0);
            expect(testDetail.reviewer).toBe('');
            expect(testDetail.threatTop).toBe(8);

        });
    });
});

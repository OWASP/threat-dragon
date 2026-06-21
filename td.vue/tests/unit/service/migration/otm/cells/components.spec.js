import components from '@/service/migration/otm/cells/components';
import otmModel from '../../otm-test-model';

describe('service/migration/otm/cells/components.js', () => {

    describe('merge OTM', () => {
        let testCells;

        describe('returns cells for representations', () => {

            it('returns cells for Application Code', () => {
                testCells = components.merge(otmModel, otmModel.representations[1].id);
                expect(testCells).toHaveLength(1);
            });

            it('returns cells for Architecture Diagram', () => {
                testCells = components.merge(otmModel, otmModel.representations[2].id);
                expect(testCells).toHaveLength(3);
            });

            it('returns no cells for absent representation', () => {
                testCells = components.merge(otmModel, 'foo-bar');
                expect(testCells).toHaveLength(0);
            });
        });
    });
});

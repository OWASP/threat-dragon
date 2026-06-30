import cells from '@/service/migration/otm/cells/cells';
import otmModel from '../../otm-test-model';

describe('service/migration/otm/cells/cells.js', () => {

    describe('merge OTM', () => {
        let testCells;

        describe('creating cells for representations', () => {

            beforeEach(() => {
                console.warn = jest.fn();
            });

            it('creates cells for Threat Diagram', () => {
                testCells = cells.merge(otmModel, otmModel.representations[0].id);
                expect(testCells).toHaveLength(2);
                expect(console.warn).toHaveBeenCalled();
            });

            it('creates cells for Application Code', () => {
                testCells = cells.merge(otmModel, otmModel.representations[1].id);
                expect(testCells).toHaveLength(1);
            });

            it('creates cells for Architecture Diagram', () => {
                testCells = cells.merge(otmModel, otmModel.representations[2].id);
                expect(testCells.length).toBeGreaterThanOrEqual(5);
            });

            it('creates no cells for absent representation', () => {
                testCells = cells.merge(otmModel, 'foo-bar');
                expect(testCells).toHaveLength(0);
            });
        });

        describe('creating cell contents for Architecture Diagram', () => {
            const otmId = otmModel.representations[2].id;

            beforeEach(() => {
                testCells = cells.merge(otmModel, otmId);
            });

            it('creates cell array', () => {
                expect(testCells.length).toBeGreaterThanOrEqual(5);
            });

            it('creates cell ID', () => {
                expect(testCells[0].id.length).toBeGreaterThanOrEqual(5);
                expect(testCells[1].id.length).toBeGreaterThanOrEqual(5);
                expect(testCells[2].id.length).toBeGreaterThanOrEqual(5);
            });

            it('creates cell name', () => {
                expect(testCells[2].data.name.length).toBeGreaterThanOrEqual(5);
                expect(testCells[2].attrs.text.text.length).toBeGreaterThanOrEqual(5);
            });

            it('creates cell description', () => {
                expect(testCells[3].data.description.length).toBeGreaterThanOrEqual(5);
            });

            it('creates cell size', () => {
                expect(testCells[0].size).toHaveProperty('width');
                expect(testCells[0].size.height).toBeDefined();
            });

            it('creates cell position', () => {
                expect(testCells[1].position.x).toBeDefined();
                expect(testCells[1].position.y).toBeDefined();
            });

            it('creates compatibility', () => {
                expect(testCells[2].compatibility).toHaveProperty('otmId');
                expect(testCells[2].compatibility).toHaveProperty('parent');
                expect(testCells[2].compatibility).toHaveProperty('tags');
            });
        });
    });
});

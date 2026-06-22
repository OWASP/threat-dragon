import cells from '@/service/migration/otm/cells/cells';
import diagrams from '@/service/migration/otm/diagrams';
import otmModel from '../otm-test-model';

jest.mock('@/service/migration/otm/cells/cells');

const testVersion = 'foo.bar';

describe('service/migration/otm/diagrams.js', () => {

    describe('merging OTM', () => {
        let testDiagrams;

        describe('creates array of diagrams', () => {

            beforeEach(() => {
                cells.merge.mockReturnValue([]);
                testDiagrams = diagrams.merge(otmModel, testVersion);
            });

            it('creates the diagrams', () => {
                expect(testDiagrams.diagrams).toHaveLength(2);
            });

            it('populates the diagramType', () => {
                expect(testDiagrams.diagrams[0].diagramType).toEqual(expect.stringContaining('OTM'));
                expect(testDiagrams.diagrams[1].diagramType).toEqual(expect.stringContaining('OTM'));
            });

            it('populates the id', () => {
                expect(testDiagrams.diagrams[0].id).toBe(0);
                expect(testDiagrams.diagrams[1].id).toBe(1);
            });

            it('populates the thumbnail', () => {
                expect(testDiagrams.diagrams[0].thumbnail.length).toBeGreaterThanOrEqual(5);
                expect(testDiagrams.diagrams[1].thumbnail.length).toBeGreaterThanOrEqual(5);
            });

            it('populates the title', () => {
                expect(testDiagrams.diagrams[0].title.length).toBeGreaterThanOrEqual(5);
                expect(testDiagrams.diagrams[1].title.length).toBeGreaterThanOrEqual(5);
            });

            it('populates the version', () => {
                expect(testDiagrams.diagrams[0].version).toBe(testVersion);
                expect(testDiagrams.diagrams[1].version).toBe(testVersion);
            });

            it('populates the cells', () => {
                expect(testDiagrams.diagrams[0].cells).toBeDefined();
                expect(testDiagrams.diagrams[1].cells).toBeDefined();
            });

            it('populates the description', () => {
                expect(testDiagrams.diagrams[0].description).toBeUndefined();
                expect(testDiagrams.diagrams[1].description.length).toBeGreaterThanOrEqual(5);
            });

            it('saves the OTM ID', () => {
                expect(testDiagrams.diagrams[0].compatibility.otmId).toBeDefined();
                expect(testDiagrams.diagrams[1].compatibility.otmId).toBeDefined();
            });

            it('saves the diagram size', () => {
                expect(testDiagrams.diagrams[0].compatibility.size).toBeUndefined();
                expect(testDiagrams.diagrams[1].compatibility.size).toBeDefined();
            });

            it('saves the diagram attributes', () => {
                expect(testDiagrams.diagrams[0].compatibility.attributes).toBeUndefined();
                expect(testDiagrams.diagrams[1].compatibility.attributes).toBeDefined();
            });

            it('saves the code representations', () => {
                expect(testDiagrams.codeRepresentations).toHaveLength(1);
            });

            it('saves the code components', () => {
                expect(testDiagrams.codeComponents).toHaveLength(1);
            });
        });

        describe('handling absent representations', () => {
            let missingRepresentation;

            beforeEach(() => {
                missingRepresentation = JSON.parse(JSON.stringify(otmModel));
                delete missingRepresentation.representations;
                testDiagrams = diagrams.merge(missingRepresentation, testVersion);
            });
    
            it('creates no diagrams', () => {
                expect(testDiagrams.diagrams).toHaveLength(0);
                expect(testDiagrams.diagrams).toBeDefined();
            });
        });
    });
});

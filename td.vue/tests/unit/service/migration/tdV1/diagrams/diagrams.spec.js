import diagrams from '@/service/migration/tdV1/diagrams/diagrams';
import v1Model from '../v1-threat-model';

const testVersion = 'testVersion';

describe('service/migration/tdV1/diagrams/diagrams.js', () => {
    let v2Diagrams;

    describe('reads version 1 model', () => {
        beforeEach(() => {
            v2Diagrams = diagrams.read(v1Model.detail.diagrams, testVersion);
        });

        it('converts diagrams', () => {
            expect(v2Diagrams).toHaveLength(2);
        });

        it('creates empty descriptions', () => {
            expect(v2Diagrams[0].description).toMatch('');
            expect(v2Diagrams[1].description).toMatch('');
        });

        it('copies the diagram type', () => {
            expect(v2Diagrams[0].diagramType).toMatch(v1Model.detail.diagrams[0].diagramType);
            expect(v2Diagrams[1].diagramType).toMatch(v1Model.detail.diagrams[1].diagramType);
        });

        it('sets the diagram identifiers', () => {
            expect(v2Diagrams[0].id).toBe(0);
            expect(v2Diagrams[1].id).toBe(1);
        });

        it('copies the diagram titles', () => {
            expect(v2Diagrams[0].title).toMatch(v1Model.detail.diagrams[0].title);
            expect(v2Diagrams[1].title).toMatch(v1Model.detail.diagrams[1].title);
        });

        it('creates the placeholders', () => {
            expect(v2Diagrams[0].placeholder).toMatch('New STRIDE diagram description');
            expect(v2Diagrams[1].placeholder).toMatch('New LINDDUN diagram description');
        });

        it('copies the diagram thumbnails', () => {
            expect(v2Diagrams[0].thumbnail).toMatch(v1Model.detail.diagrams[0].thumbnail);
            expect(v2Diagrams[1].thumbnail).toMatch(v1Model.detail.diagrams[1].thumbnail);
        });

        it('updates the diagram version', () => {
            expect(v2Diagrams[0].version).toMatch(testVersion);
            expect(v2Diagrams[1].version).toMatch(testVersion);
        });

        it('creates components for first diagram', () => {
            expect(v2Diagrams[0].cells.length).toBeGreaterThan(0);
            expect(v2Diagrams[0].cells).toHaveLength(5);
        });

        it('counts components for second diagram', () => {
            expect(v2Diagrams[1].cells.length).toBeGreaterThan(0);
		    expect(v2Diagrams[1].cells).toHaveLength(1);
        });
    });

    describe('reads model with no diagrams', () => {
        let emptyDiagrams = new Array();

        it('converts diagrams', () => {
            v2Diagrams = diagrams.read(emptyDiagrams, testVersion);
            expect(v2Diagrams).toHaveLength(0);
        });

    });
});

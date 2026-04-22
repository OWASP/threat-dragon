import threatDragonV1 from '@/service/migration/tdV1/threatDragonV1';
import v1Model from './v1-threat-model';

const emtpyV1Model = {'summary':{'title':'New threat model'},'detail':{'contributors':[],'diagrams':[]}};

describe('service/migration/tdV1/threatDragonV1.js', () => {
    let v2Model;

    describe('reads version 1 model', () => {
        beforeEach(() => {
            v2Model = threatDragonV1.read(v1Model);
        });

        it('updates the version', () => {
            expect(v2Model.version).toMatch(/^2\.(0|[1-9]*)\.(0|[1-9]*)/);
        });

        it('copies the version 1 summary', () => {
            expect(v2Model.summary).toMatchObject(v1Model.summary);
            expect(v2Model.summary.id).not.toBeNull();
        });

        it('provides the detail', () => {
            expect(v2Model.detail.contributors.length).toBeGreaterThan(0);
            expect(v2Model.detail.diagrams.length).toBeGreaterThan(0);
            expect(v2Model.detail.diagramTop).toBeGreaterThan(0);
            expect(v2Model.detail.reviewer).not.toBe(null);
            expect(v2Model.detail.threatTop).toBeGreaterThan(0);
        });
    });

    describe('reads empty version 1 model', () => {
        beforeEach(() => {
            v2Model = threatDragonV1.read(emtpyV1Model);
        });

        it('provides the version', () => {
            expect(v2Model.version).toMatch(/^2\.(0|[1-9]*)\.(0|[1-9]*)/);
        });

        it('copies minimal version 1 summary', () => {
            expect(v2Model.summary.description).toBe('');
            expect(v2Model.summary.id).not.toBeNull();
            expect(v2Model.summary.owner).toBe('');
            expect(v2Model.summary.title).toBe('New threat model');
        });

        it('provides minimal detail', () => {
            expect(v2Model.detail.contributors).toHaveLength(0);
            expect(v2Model.detail.diagrams).toHaveLength(0);
            expect(v2Model.detail.diagramTop).toBe(0);
            expect(v2Model.detail.reviewer).toMatch('');
            expect(v2Model.detail.threatTop).toBe(1000);
        });
    });

    describe('provides version', () => {
        it('reports the version', () => {
            expect(threatDragonV1.version).toMatch(/^2\.(0|[1-9]*)\.(0|[1-9]*)/);
        });
    });

});

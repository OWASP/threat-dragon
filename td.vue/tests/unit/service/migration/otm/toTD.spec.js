import { convert as convertOTMtoTD } from '@/service/migration/otm/toTD';
import otmModel from './otm_example';

describe('service/migration/otm/toTD.js', () => {
    let tdModel;

    describe('convert OTM project', () => {
        beforeEach(() => {
            tdModel = convertOTMtoTD(otmModel);
        });

        it('preserves otm version', () => {
            expect(tdModel.otmVersion).toBe(otmModel.otmVersion);
        });

        it('converts otm project name', () => {
            expect(tdModel.summary.title).toEqual(otmModel.project.name);
        });

        it('converts otm project id', () => {
            expect(tdModel.summary.id).toEqual(otmModel.project.id);
        });

        it('converts otm project description', () => {
            expect(tdModel.summary.description).toMatch(new RegExp(otmModel.project.description));
        });

        it('converts otm project owner', () => {
            expect(tdModel.summary.owner).toEqual(otmModel.project.owner);
        });

        it('preserves otm project owner contact', () => {
            expect(tdModel.summary.ownerContact).toEqual(otmModel.project.ownerContact);
        });

        it('preserves otm project tags', () => {
            expect(tdModel.summary.tags).toEqual(otmModel.project.tags);
        });

        it('preserves otm project attributes', () => {
            expect(tdModel.summary.attributes).toEqual(otmModel.project.attributes);
        });

    });

    describe('convert OTM representations', () => {
        beforeEach(() => {
            tdModel = convertOTMtoTD(otmModel);
        });

        it('preserves otm version', () => {
            expect(tdModel.otmVersion).toBe('0.2.0');
        });

        it('counts the diagrams', () => {
            expect(tdModel.detail.diagramTop).toBe(1);
        });

        it('provides the diagram id', () => {
            expect(tdModel.detail.diagrams[0].id).toBe(0);
        });

        it('reserves the representation id', () => {
            expect(tdModel.detail.diagrams[0].otmId).toBe(otmModel.representations[0].id);
        });

        it('converts the representation name', () => {
            expect(tdModel.detail.diagrams[0].title).toBe('Architecture Diagram');
        });

        it('converts the representation description', () => {
            expect(tdModel.detail.diagrams[0].description).toBeUndefined();
        });

        it('preserves the representation size', () => {
            expect(tdModel.detail.diagrams[0].size).toEqual({ 'width': 1000, 'height': 1100 });
        });

        it('preserves a non-diagram representation', () => {
            expect(tdModel.detail.representations[0]).toEqual(otmModel.representations[1]);
        });

    });
});

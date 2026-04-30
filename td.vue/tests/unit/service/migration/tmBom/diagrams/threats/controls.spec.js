import boundaries from '@/service/migration/tmBom/diagrams/threats/boundaries';
import controls from '@/service/migration/tmBom/diagrams/threats/controls';
import tmBomModel from '../../test-model';
import { threats as mockTdThreats } from './mockTdThreats';

jest.mock('@/service/migration/tmBom/diagrams/threats/boundaries');

describe('service/migration/tmBom/diagrams/threats/controls.js', () => {

    describe('updates the threats', () => {
        boundaries.merge.mockImplementation((_model, control) => control);
        let tdThreats = JSON.parse(JSON.stringify(mockTdThreats));
        let threats = controls.merge(tmBomModel, tdThreats);

        it('adds the control title', () => {
            expect(threats[0].mitigation).toContain('Test title control0');
            expect(threats[0].mitigation).toContain('Test title control3');
            expect(threats[1].mitigation).toContain('Test title control0');
            expect(threats[1].mitigation).toContain('Test title control4');
            expect(threats[4].mitigation).not.toContain('Test title control0');
            expect(threats[4].mitigation).toContain('Test title control7');
        });

        it('adds the control status', () => {
            expect(threats[0].mitigation).toContain('assumed');
            expect(threats[0].mitigation).toContain('under review');
            expect(threats[1].mitigation).toContain('assumed');
            expect(threats[1].mitigation).toContain('approved');
            expect(threats[4].mitigation).not.toContain('assumed');
            expect(threats[4].mitigation).toContain('wont do');
        });

        it('updates threat status', () => {
            expect(threats[0].status).toBe('Mitigated');
            expect(threats[1].status).toBe('Mitigated');
            expect(threats[2].status).toBe('Mitigated');
            expect(threats[3].status).toBe('Open');
            expect(threats[4].status).toBe('Mitigated');
        });

        it('sets threat severity', () => {
            expect(threats[0].severity).toBe('Critical');
            expect(threats[1].severity).toBe('Medium');
            expect(threats[2].severity).toBe('High');
            expect(threats[3].severity).toBe('High');
            expect(threats[4].severity).toBe('Critical');
        });

    });

    describe('handles absence of controls', () => {
        let uncontrolsTmBomModel = Object.assign({}, tmBomModel);
        delete(uncontrolsTmBomModel.controls);
        boundaries.merge.mockImplementation((_model, control) => control);
        let threats = controls.merge(uncontrolsTmBomModel, mockTdThreats);

        it('skips boundaries', () => {
		    expect(boundaries.merge).not.toHaveBeenCalled();
        });

        it('preserves threat severity', () => {
		    expect(threats[0].severity).toBe('TBD');
		    expect(threats[1].severity).toBe('Low');
		    expect(threats[2].severity).toBe('Medium');
		    expect(threats[3].severity).toBe('High');
		    expect(threats[4].severity).toBe('Critical');
        });

    });
});

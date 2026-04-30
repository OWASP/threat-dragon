import boundaries from '@/service/migration/tmBom/diagrams/threats/boundaries';
import tmBomModel from '../../test-model';

const trust_boundary = {
    trust_zone_a: 'trust-zone0',
    trust_zone_b: 'trust-zone1'    ,
};

const missingBoundary = {
    'trust_zone_a': 'no-trust-zonea',
    'trust_zone_b': 'no-trust-zoneb'
};

describe('service/migration/tmBom/diagrams/threats/boundaries.js', () => {

    describe('finds boundaries', () => {

        it('finds an existing boundary within boundary array', () => {
            expect(boundaries.find(tmBomModel.trust_boundaries, trust_boundary)).not.toBe(null);
        });

        it('handles absent boundary array', () => {
            expect(boundaries.find(null, trust_boundary)).toBe(null);
        });

        it('handles absent boundary', () => {
            expect(boundaries.find(tmBomModel.trust_boundaries, null)).toBe(null);
        });

        it('handles an unused boundary', () => {
            expect(boundaries.find(tmBomModel.trust_boundaries, missingBoundary)).toBe(null);
        });

    });

    describe('updates control description', () => {
        let mockControl = {description: 'mock description', trust_boundary};
        let control;

        beforeEach(() => {
		    control = boundaries.merge(tmBomModel, mockControl);
        });

        it('lists the boundaries', () => { 
            expect(control.description).toContain('Applied across boundaries');
            expect(control.description).toContain(trust_boundary.trust_zone_a);
            expect(control.description).toContain(trust_boundary.trust_zone_b);
        });

        it('lists the authX methods', () => {
            expect(control.description).toContain('acl, rbac, mac');
            expect(control.description).toContain('password, otp, challenge response, public key');
            expect(control.description).toContain('ser logout');
            expect(control.description).toContain('ystem logout');
        });

        it('shows the access and refresh token attributes', () => {
            expect(control.description).toContain('token expiry');
            expect(control.description).toContain('token time to live');
            expect(control.description).toContain('efresh tokens');
            expect(control.description).toContain('efresh token expires');
            expect(control.description).toContain('efresh token time to live');
        });
    });

    describe('ignores controls with no boundaries', () => {
        let mockControl = {description: 'mock description', missingBoundary}; 

	    it('preserves description', () => {
            let control = boundaries.merge(tmBomModel, mockControl);
            expect(control.description).toEqual(mockControl.description);
	    });
    });
});

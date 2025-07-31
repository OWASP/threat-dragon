import boundaries from '@/service/migration/tmBom/diagrams/threats/boundaries';
import tmBomModel from '../../test-model';

const mockModel = {
    trust_boundaries: [
        {
            trust_zone_a: 'public',
            trust_zone_b: 'experimental-zone',
            access_control_methods: ['rbac', 'acl'],
            authentication_methods: ['password', 'biometrics'],
            access_token_expires: true,
            access_token_ttl: 3600,
            has_refresh_token: false,
            refresh_token_expires: true,
            refresh_token_ttl: 1800,
            can_user_logout: false,
            can_system_logout: true            
        }
    ]    
};

const trust_boundary = {
    trust_zone_a: 'public',
    trust_zone_b: 'experimental-zone'    ,
};

const missingBoundary = {
    'trust_zone_a': 'user-key-store',
    'trust_zone_b': 'ssh-service'
};

var mockControl = {description: 'mock description', trust_boundary};

describe('service/migration/tmBom/diagrams/threats/boundaries.js', () => {

    describe('finds boundaries', () => {

        it('finds an existing boundary', () => {
            expect(boundaries.find(tmBomModel.trust_boundaries, trust_boundary)).not.toBe(null);
        });

        it('returns null when boundaries are missing', () => {
            expect(boundaries.find(null, trust_boundary)).toBe(null);
        });

        it('returns null when boundary is absent', () => {
            expect(boundaries.find(tmBomModel.trust_boundaries, null)).toBe(null);
        });

        it('does not find a missing boundary', () => {
            expect(boundaries.find(tmBomModel.trust_boundaries, missingBoundary)).toBe(null);
        });

    });

    describe('updates control description', () => {

        it('lists the boundaries', () => {
            let control = boundaries.merge(tmBomModel, mockControl);
            expect(control.description).toContain('Applied across boundaries');
            expect(control.description).toContain(trust_boundary.trust_zone_a);
            expect(control.description).toContain(trust_boundary.trust_zone_b);
        });

        it('lists the authX methods', () => {
            let control = boundaries.merge(mockModel, mockControl);
            expect(control.description).toContain('rbac,acl');
            expect(control.description).toContain('password,biometrics');
            expect(control.description).not.toContain('User logout');
            expect(control.description).toContain('System logout');
        });

        it('shows the access and refresh token attributes', () => {
            let control = boundaries.merge(mockModel, mockControl);
            expect(control.description).toContain('Access token expiry: true');
            expect(control.description).toContain('3600');
            expect(control.description).not.toContain('Refresh token');
        });
    });
});

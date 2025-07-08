import controls from '@/service/migration/tmBom/diagrams/threats/controls';
import tmBomModel from '../../test-model';

const tdThreats = [
    {
        status: 'Open',
        severity: 'TBD',
        description: 'An attacker crafts an image',
        title: 'Buffer overflow',
        type: 'Generic',
        mitigation: '',
        modelType: 'Generic',
        id: 'buffer-overflow-image-processing'
    },
    {
        status: 'Open',
        severity: 'TBD',
        description: 'An attacker poisons the supply chain',
        title: 'Supply chain attack',
        type: 'Generic',
        mitigation: '',
        modelType: 'Generic',
        id: 'supply-chain-attack'
    },
    {
        status: 'Open',
        severity: 'TBD',
        description: 'An attacker tampers with or deletes stored images',
        title: 'Image Tampering',
        type: 'Generic',
        mitigation: '',
        modelType: 'Generic',
        id: 'image-tampering'
    },
    {
        status: 'Open',
        severity: 'TBD',
        description: 'An attacker modifies a notebook file',
        title: 'Notebook tampering',
        type: 'Generic',
        mitigation: '',
        modelType: 'Generic',
        id: 'notebook-tampering'
    }
];

describe('service/migration/tmBom/diagrams/threats/controls.js', () => {
    var threats = controls.merge(tmBomModel, tdThreats);

    describe('updates the threats', () => {

        it('provides first threat mitigation', () => {
            expect(threats[0].mitigation).toContain('Implement sandboxing');
            expect(threats[1].mitigation).toContain('Validate TLS usage');
            expect(threats[2].mitigation).toContain('Ensure appropriate access control');
            expect(threats[3].mitigation).toContain('Store hashes and validate integrity');
        });

        it('provides second threat mitigation', () => {
            expect(threats[0].mitigation).toContain('Cheat Sheet for File Upload');
            expect(threats[1].mitigation).toContain('SCA scanning and patching');
            expect(threats[2].mitigation).toContain('Have access logging in place');
            expect(threats[3].mitigation).toContain('Ensure appropriate access control');
        });

        it('provides third threat mitigation', () => {
            expect(threats[2].mitigation).toContain('Ensure backups for Azure Blob');
            expect(threats[3].mitigation).toContain('Developer machine endpoint security');
        });

        it('provides threat mitigation description', () => {
            expect(threats[0].mitigation).toContain('processing in isolated environment');
            expect(threats[1].mitigation).toContain('Regularly scan third-party dependencies');
            expect(threats[2].mitigation).toContain('Ensure developer machines are patched');
            expect(threats[3].mitigation).toContain('Ensure developer machines are patched');
        });

        it('updates threat status', () => {
            expect(threats[0].status).toBe('Open');
            expect(threats[1].status).toBe('Open');
            expect(threats[2].status).toBe('Mitigated');
            expect(threats[3].status).toBe('Mitigated');
        });

        it('sets threat severity', () => {
            expect(threats[0].severity).toBe('Critical');
            expect(threats[1].severity).toBe('Critical');
            expect(threats[2].severity).toBe('Critical');
            expect(threats[3].severity).toBe('Critical');
        });

    });
});

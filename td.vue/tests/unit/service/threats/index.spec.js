import threats, { createNewTypedThreat } from '@/service/threats/index.js';

describe('service/threats/index.js', () => {
    describe('create new default typed threat', () => {
        let threat;

        beforeEach(() => {
            threat = createNewTypedThreat();
        });

        it('has an id', () => {
            expect(threat.id).not.toBeUndefined();
        });

        it('has a default title', () => {
            expect(threat.title).toEqual('New STRIDE threat');
        });

        it('has an open status', () => {
            expect(threat.status).toEqual('Open');
        });

        it('has a TBD severity', () => {
            expect(threat.severity).toEqual('TBD');
        });

        it('has a defined type', () => {
            expect(threat.type).toEqual('Tampering');
        });

        it('has a reasonable description', () => {
            expect(threat.description.length).toBeGreaterThan(10);
        });

        it('has a reasonable mitigation', () => {
            expect(threat.mitigation.length).toBeGreaterThan(10);
        });

        it('has a defined modelType', () => {
            expect(threat.modelType).toEqual('STRIDE');
        });
    });

    describe('create new LINDDUN threat', () => {
        let threat;

        beforeEach(() => {
            threat = createNewTypedThreat('LINDDUN');
        });

        it('has a typed title', () => {
            expect(threat.title).toEqual('New LINDDUN threat');
        });

        it('has Linkability type', () => {
            expect(threat.type).toEqual('Linkability');
        });

        it('has a LINDDUN modelType', () => {
            expect(threat.modelType).toEqual('LINDDUN');
        });
    });

    describe('create new PLOT4ai threat', () => {
        let threat;

        beforeEach(() => {
            threat = createNewTypedThreat('PLOT4ai');
        });

        it('has a typed title', () => {
            expect(threat.title).toEqual('New PLOT4ai threat');
        });

        it('has Technique & Processes type', () => {
            expect(threat.type).toEqual('Technique & Processes');
        });

        it('has a PLOT4ai modelType', () => {
            expect(threat.modelType).toEqual('PLOT4ai');
        });
    });

    describe('create new CIA threat', () => {
        let threat;

        beforeEach(() => {
            threat = createNewTypedThreat('CIA');
        });

        it('has a typed title', () => {
            expect(threat.title).toEqual('New CIA threat');
        });

        it('has Confidentiality type', () => {
            expect(threat.type).toEqual('Confidentiality');
        });

        it('has a CIA modelType', () => {
            expect(threat.modelType).toEqual('CIA');
        });
    });

    describe('create new CIA-DIE threat', () => {
        let threat;

        beforeEach(() => {
            threat = createNewTypedThreat('CIADIE');
        });

        it('has a typed title', () => {
            expect(threat.title).toEqual('New CIA-DIE threat');
        });

        it('has Distributed type', () => {
            expect(threat.type).toEqual('Distributed');
        });

        it('has a CIA-DIE modelType', () => {
            expect(threat.modelType).toEqual('CIADIE');
        });
    });

    describe('hasOpenThreats', () => {
        it('returns false if there is no data', () => {
            expect(threats.hasOpenThreats(null))
                .toEqual(false);
        });

        it('returns false if there are no threats', () => {
            expect(threats.hasOpenThreats({}))
                .toEqual(false);
        });

        it('returns false if there are not open threats', () => {
            const data = {
                threats: [
                    { status: 'Mitigated' },
                    { status: 'NotApplicable' }
                ]
            };
            expect(threats.hasOpenThreats(data))
                .toEqual(false);
        });

        it('returns false if there are threats', () => {
            const data = {
                threats: [
                    { status: 'Mitigated' },
                    { status: 'Open' }
                ]
            };
            expect(threats.hasOpenThreats(data))
                .toEqual(true);
        });
    });

    /**
     * This structure doesn´t accomodate for the fact that frameworks can have
     * categories with the same name. This is problem for plot4ai & linddun.
     * However, this functionality is only used in the v1->v2 migration flow and it is unlikely
     * to find plot4ai in v1 json files (due to it's recent addition).
     * PLOT4ai has therefor not been added to these unit-tests
     */
    describe('convertToTranslationString', () => {

        it('converts Confidentiality to the translation string', () => {
            expect(threats.convertToTranslationString('Confidentiality'))
                .toEqual('threats.model.cia.confidentiality');
        });

        it('converts Integrity to the translation string', () => {
            expect(threats.convertToTranslationString('Integrity'))
                .toEqual('threats.model.cia.integrity');
        });

        it('converts Availability to the translation string', () => {
            expect(threats.convertToTranslationString('Availability'))
                .toEqual('threats.model.cia.availability');
        });

        it('converts Distributed to the translation string', () => {
            expect(threats.convertToTranslationString('Distributed'))
                .toEqual('threats.model.die.distributed');
        });

        it('converts Immutable to the translation string', () => {
            expect(threats.convertToTranslationString('Immutable'))
                .toEqual('threats.model.die.immutable');
        });

        it('converts Ephemeral to the translation string', () => {
            expect(threats.convertToTranslationString('Ephemeral'))
                .toEqual('threats.model.die.ephemeral');
        });

        it('converts Linkability to the translation string', () => {
            expect(threats.convertToTranslationString('Linkability'))
                .toEqual('threats.model.linddun.linkability');
        });

        it('converts Identifiability to the translation string', () => {
            expect(threats.convertToTranslationString('Identifiability'))
                .toEqual('threats.model.linddun.identifiability');
        });

        it('converts Non-repudiation to the translation string', () => {
            expect(threats.convertToTranslationString('Non-repudiation'))
                .toEqual('threats.model.linddun.nonRepudiation');
        });

        it('converts Detectability to the translation string', () => {
            expect(threats.convertToTranslationString('Detectability'))
                .toEqual('threats.model.linddun.detectability');
        });

        it('converts Disclosure of information to the translation string', () => {
            expect(threats.convertToTranslationString('Disclosure of information'))
                .toEqual('threats.model.linddun.disclosureOfInformation');
        });

        it('converts Unawareness to the translation string', () => {
            expect(threats.convertToTranslationString('Unawareness'))
                .toEqual('threats.model.linddun.unawareness');
        });

        it('converts Non-compliance to the translation string', () => {
            expect(threats.convertToTranslationString('Non-compliance'))
                .toEqual('threats.model.linddun.nonCompliance');
        });

        it('converts Spoofing to the translation string', () => {
            expect(threats.convertToTranslationString('Spoofing'))
                .toEqual('threats.model.stride.spoofing');
        });

        it('converts Tampering to the translation string', () => {
            expect(threats.convertToTranslationString('Tampering'))
                .toEqual('threats.model.stride.tampering');
        });

        it('converts Repudiation to the translation string', () => {
            expect(threats.convertToTranslationString('Repudiation'))
                .toEqual('threats.model.stride.repudiation');
        });

        it('converts Information disclosure to the translation string', () => {
            expect(threats.convertToTranslationString('Information disclosure'))
                .toEqual('threats.model.stride.informationDisclosure');
        });

        it('converts Denial of service to the translation string', () => {
            expect(threats.convertToTranslationString('Denial of service'))
                .toEqual('threats.model.stride.denialOfService');
        });

        it('converts Elevation of privilege to the translation string', () => {
            expect(threats.convertToTranslationString('Elevation of privilege'))
                .toEqual('threats.model.stride.elevationOfPrivilege');
        });
    });

    describe('filterForDiagram', () => {
        it('returns an emtpy array if out of scope', () => {
            const res = threats.filterForDiagram({ outOfScope: true }, { showOutOfScope: false });
            expect(res).toEqual([]);
        });

        it('returns an emtpy array if there are no threats', () => {
            const res = threats.filterForDiagram({}, {});
            expect(res).toEqual([]);
        });

        it('does not filter any threats if showMitigated is selected', () => {
            const data = {
                threats: [
                    { status: 'Open' },
                    { status: 'Mitigated' }
                ]
            };
            const res = threats.filterForDiagram(data, { showMitigated: true });
            expect(res).toHaveLength(data.threats.length);
        });

        it('filters mitigated threats', () => {
            const data = {
                threats: [
                    { status: 'Open' },
                    { status: 'Mitigated' }
                ]
            };
            const res = threats.filterForDiagram(data, { showMitigated: false });
            expect(res).toHaveLength(1);
        });
    });

    describe('filter', () => {
        it('returns an empty array if there are no cells with data', () => {
            const diagrams = [{ cells: [{}]}];
            const res = threats.filter(diagrams, {});
            expect(res).toEqual([]);
        });

        it('returns an empty array if there are no cells with threats', () => {
            const diagrams = [{ cells: [{ data: {} }] }];
            const res = threats.filter(diagrams, {});
            expect(res).toEqual([]);
        });

        it('returns all threats if no filters are provided', () => {

            const diagrams = [{ cells: [{ data: { threats: [{ status: 'mitigated' }]} }] }];
            const res = threats.filter(diagrams, {});
            expect(res).toHaveLength(1);
        });
    });
});

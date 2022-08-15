import threats, { createNewThreat } from '@/service/threats/index.js';

describe('service/threats/index.js', () => {
    describe('createNewThreat', () => {
        let threat;

        beforeEach(() => {
            threat = createNewThreat();
        });

        it('has an id', () => {
            expect(threat.id).not.toBeUndefined();
        });

        it('has a deafualt title', () => {
            expect(threat.title).toEqual('Generic threat');
        });

        it('has an empty status', () => {
            expect(threat.status).toEqual('');
        });

        it('has an empty severity', () => {
            expect(threat.severity).toEqual('');
        });

        it('has an empty type', () => {
            expect(threat.type).toEqual('');
        });

        it('has an empty description', () => {
            expect(threat.description).toEqual('');
        });

        it('has an empty mitigation', () => {
            expect(threat.mitigation).toEqual('');
        });

        it('has an empty modelType', () => {
            expect(threat.modelType).toEqual('');
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

    describe('convertToTranslationString', () => {
        it('converts confidentiality to the translation string', () => {
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

import {
    translateKnownKey,
    translateProviderDisplayName,
    translateProviderLogin
} from '@/service/i18n/translation.js';

const translate = (key) => key;

describe('service/i18n/translation.js', () => {
    it('translates each supported provider display name', () => {
        ['desktop', 'github', 'gitlab', 'bitbucket', 'google', 'local'].forEach((provider) => {
            expect(translateProviderDisplayName(translate, provider)).toBe(`providers.${provider}.displayName`);
        });
    });

    it('translates each supported provider login label', () => {
        ['desktop', 'github', 'gitlab', 'bitbucket', 'google', 'local'].forEach((provider) => {
            expect(translateProviderLogin(translate, provider)).toBe(`providers.${provider}.loginWith`);
        });
    });

    it('returns an empty string for an unsupported provider', () => {
        expect(translateProviderDisplayName(translate, 'unknown')).toBe('');
    });

    it('returns an empty string for an unsupported provider login label', () => {
        expect(translateProviderLogin(translate, 'unknown')).toBe('');
    });

    it('translates each recognized dynamic key', () => {
        [
            'branch.protectedBranch',
            'dashboard.actions.openExisting',
            'dashboard.actions.createNew',
            'dashboard.actions.readDemo',
            'dashboard.actions.importExisting',
            'dashboard.actions.createFromTemplate',
            'threatmodel.shapes.actor',
            'threatmodel.shapes.flow',
            'threatmodel.shapes.flowStencil',
            'threatmodel.shapes.process',
            'threatmodel.shapes.store',
            'threatmodel.shapes.text',
            'threatmodel.shapes.trustBoundary',
            'threatmodel.errors.invalidJson',
            'threatmodel.errors.onlyJsonAllowed',
            'threatmodel.errors.open',
            'threats.model.cia.confidentiality',
            'threats.model.cia.availability',
            'threats.model.cia.integrity',
            'threats.model.ciadie.distributed',
            'threats.model.ciadie.availability',
            'threats.model.ciadie.confidentiality',
            'threats.model.ciadie.ephemeral',
            'threats.model.ciadie.immutable',
            'threats.model.ciadie.integrity',
            'threats.model.linddun.linkability',
            'threats.model.linddun.detectability',
            'threats.model.linddun.disclosureOfInformation',
            'threats.model.linddun.identifiability',
            'threats.model.linddun.nonCompliance',
            'threats.model.linddun.nonRepudiation',
            'threats.model.linddun.unawareness',
            'threats.model.plot4ai.security',
            'threats.model.plot4ai.accessibility',
            'threats.model.plot4ai.ethicsHumanRights',
            'threats.model.plot4ai.identifiabilityLinkability',
            'threats.model.plot4ai.nonCompliance',
            'threats.model.plot4ai.safety',
            'threats.model.plot4ai.techniqueProcesses',
            'threats.model.plot4ai.unawareness',
            'threats.model.stride.spoofing',
            'threats.model.stride.denialOfService',
            'threats.model.stride.elevationOfPrivilege',
            'threats.model.stride.informationDisclosure',
            'threats.model.stride.repudiation',
            'threats.model.stride.tampering',
            'threats.generic.cia',
            'threats.generic.ciadie',
            'threats.generic.default',
            'threats.generic.eop',
            'threats.generic.linddun',
            'threats.generic.plot4ai',
            'threats.generic.stride'
        ].forEach((key) => {
            expect(translateKnownKey(translate, key)).toBe(key);
        });
    });

    it('returns an unrecognized key unchanged', () => {
        expect(translateKnownKey(translate, 'unknown.key')).toBe('unknown.key');
    });
});

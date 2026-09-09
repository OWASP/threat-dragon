import {
    translateKnownKey,
    translateProviderDisplayName,
    translateProviderLogin
} from '@/service/i18n/translation.js';
import { getPrimaryStatusOptions, getTreatmentStatusOptions } from '@/service/threats/status.js';
import cia from '@/service/threats/models/cia.json';
import ciadie from '@/service/threats/models/ciadie.json';
import linddun from '@/service/threats/models/linddun.json';
import plot4ai from '@/service/threats/models/plot4ai.json';
import stride from '@/service/threats/models/stride.json';
import threatModels from '@/service/threats/models/index.js';
import { getDashboardActions, providerNames } from '@/service/provider/providers.js';

const translate = (key) => `translated:${key}`;
const translated = (key) => `translated:${key}`;
const modelTranslationKeys = (model) => Object.values(model).flatMap((value) =>
    typeof value === 'string' ? value : modelTranslationKeys(value)
);

describe('service/i18n/translation.js', () => {
    it('translates each supported provider display name', () => {
        Object.values(providerNames).forEach((provider) => {
            expect(translateProviderDisplayName(translate, provider)).toBe(translated(`providers.${provider}.displayName`));
        });
    });

    it('translates each supported provider login label', () => {
        Object.values(providerNames).forEach((provider) => {
            expect(translateProviderLogin(translate, provider)).toBe(translated(`providers.${provider}.loginWith`));
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
            'threats.generic.cia',
            'threats.generic.ciadie',
            'threats.generic.default',
            'threats.generic.eop',
            'threats.generic.linddun',
            'threats.generic.plot4ai',
            'threats.generic.stride'
        ].forEach((key) => {
            expect(translateKnownKey(translate, key)).toBe(translated(key));
        });
    });

    it('translates every status key provided by the status service', () => {
        const keys = [
            ...getPrimaryStatusOptions((key) => key),
            ...getTreatmentStatusOptions((key) => key)
        ].map(({ text }) => text);

        keys.forEach((key) => {
            expect(translateKnownKey(translate, key)).toBe(translated(key));
        });
    });

    it('translates every threat-model key from the model definitions', () => {
        [cia, ciadie, linddun, plot4ai, stride]
            .flatMap(modelTranslationKeys)
            .forEach((key) => {
                expect(translateKnownKey(translate, key)).toBe(translated(key));
            });
    });

    it('translates every generic threat-model key', () => {
        Object.keys(threatModels.getThreatTypesByElement('unknown', 'tm.Actor'))
            .forEach((key) => {
                expect(translateKnownKey(translate, key)).toBe(translated(key));
            });
    });

    it('translates every dashboard action from the provider definitions', () => {
        Object.values(providerNames)
            .flatMap(getDashboardActions)
            .forEach(({ key }) => {
                const translationKey = `dashboard.actions.${key}`;
                expect(translateKnownKey(translate, translationKey)).toBe(translated(translationKey));
            });
    });

    it('translates all report entity types', () => {
        const entityTypes = {
            'tm.Actor': 'threatmodel.shapes.actor',
            'tm.Boundary': 'threatmodel.shapes.trustBoundary',
            'tm.BoundaryBox': 'threatmodel.shapes.trustBoundary',
            'tm.BoundaryStencil': 'threatmodel.shapes.trustBoundary',
            'tm.Flow': 'threatmodel.shapes.flow',
            'tm.FlowStencil': 'threatmodel.shapes.flow',
            'tm.Process': 'threatmodel.shapes.process',
            'tm.Store': 'threatmodel.shapes.store',
            'tm.Text': 'threatmodel.shapes.text',
            'td.Actor': 'threatmodel.shapes.actor',
            'td.Boundary': 'threatmodel.shapes.trustBoundary',
            'td.BoundaryBox': 'threatmodel.shapes.trustBoundary',
            'td.BoundaryStencil': 'threatmodel.shapes.trustBoundary',
            'td.Flow': 'threatmodel.shapes.flow',
            'td.FlowStencil': 'threatmodel.shapes.flow',
            'td.Process': 'threatmodel.shapes.process',
            'td.Store': 'threatmodel.shapes.store',
            'td.Text': 'threatmodel.shapes.text'
        };

        Object.entries(entityTypes).forEach(([entityType, key]) => {
            expect(translateKnownKey(translate, entityType)).toBe(translated(key));
        });
    });

    it('returns an unrecognized key unchanged', () => {
        expect(translateKnownKey(translate, 'unknown.key')).toBe('unknown.key');
    });
});

import { expect } from 'chai';

import {
    analyticsEventProperties,
    analyticsEvents,
    pageViewPaths
} from '../../src/constants/analyticsEvents.js';
import {
    createPlausiblePayload,
    hasValidProperties,
    isAnalyticsEvent
} from '../../src/helpers/plausible.helper.js';

describe('helpers/plausible.helper.js', () => {
    const config = { PLAUSIBLE_DOMAIN: 'threatdragon.test' };

    it('recognizes allowlisted event names', () => {
        expect(isAnalyticsEvent(analyticsEvents.DIAGRAM_CREATED)).to.equal(true);
    });

    it('rejects arbitrary event names', () => {
        expect(isAnalyticsEvent('model name')).to.equal(false);
    });

    it('allows no properties for an event without properties', () => {
        expect(hasValidProperties(analyticsEvents.DIAGRAM_CREATED)).to.equal(true);
    });

    it('rejects properties for an event without properties', () => {
        expect(hasValidProperties(analyticsEvents.DIAGRAM_CREATED, { title: 'model name' })).to.equal(false);
    });

    it('requires properties for an event with a property', () => {
        expect(hasValidProperties(analyticsEvents.PROVIDER_SELECTED)).to.equal(false);
    });

    it('rejects primitive properties', () => {
        expect(hasValidProperties(analyticsEvents.PROVIDER_SELECTED, 'local')).to.equal(false);
    });

    it('rejects property arrays', () => {
        expect(hasValidProperties(analyticsEvents.PROVIDER_SELECTED, ['local'])).to.equal(false);
    });

    it('rejects missing property names', () => {
        expect(hasValidProperties(analyticsEvents.PROVIDER_SELECTED, {})).to.equal(false);
    });

    it('rejects extra property names', () => {
        expect(hasValidProperties(analyticsEvents.PROVIDER_SELECTED, {
            provider: 'local',
            model: 'private'
        })).to.equal(false);
    });

    it('rejects unexpected property names', () => {
        expect(hasValidProperties(analyticsEvents.PROVIDER_SELECTED, { source: 'local' })).to.equal(false);
    });

    it('rejects property values outside the allow-list', () => {
        expect(hasValidProperties(analyticsEvents.PROVIDER_SELECTED, { provider: 'private' })).to.equal(false);
    });

    it('rejects local as a model-open source', () => {
        expect(hasValidProperties(analyticsEvents.THREAT_MODEL_OPENED, { source: 'local' })).to.equal(false);
    });

    it('allows the fixed property value for an event', () => {
        expect(hasValidProperties(analyticsEvents.PROVIDER_SELECTED, { provider: 'local' })).to.equal(true);
    });

    Object.entries(analyticsEventProperties).forEach(([event, allowedProperties]) => {
        const [propertyName] = Object.keys(allowedProperties);
        it(`allows the declared property for ${event}`, () => {
            expect(hasValidProperties(event, {
                [propertyName]: allowedProperties[propertyName][0]
            })).to.equal(true);
        });
    });

    it('uses only fixed page paths without route parameters', () => {
        expect(Object.values(pageViewPaths).every(path => !path.includes(':'))).to.equal(true);
    });

    it('creates a synthetic pageview payload', () => {
        expect(createPlausiblePayload(config, analyticsEvents.PAGE_VIEW_DASHBOARD)).to.deep.equal({
            domain: 'threatdragon.test',
            name: 'pageview',
            url: 'https://threatdragon.test/dashboard'
        });
    });

    it('creates a custom event payload with only its allowlisted property', () => {
        expect(createPlausiblePayload(
            config,
            analyticsEvents.THREAT_MODEL_EDIT_SESSION_ENDED,
            { duration_bucket: 'SIXTY_PLUS_MINUTES' }
        )).to.deep.equal({
            domain: 'threatdragon.test',
            name: analyticsEvents.THREAT_MODEL_EDIT_SESSION_ENDED,
            url: 'https://threatdragon.test/analytics',
            props: { duration_bucket: 'SIXTY_PLUS_MINUTES' }
        });
    });
});

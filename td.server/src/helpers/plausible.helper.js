import {
    analyticsEventNames,
    analyticsEventProperties,
    pageViewPaths
} from '../constants/analyticsEvents.js';

export const isAnalyticsEvent = (event) => analyticsEventNames.includes(event);

const hasExpectedPropertyNames = (allowedProperties, props) => {
    const propertyNames = Object.keys(props);
    const allowedPropertyNames = Object.keys(allowedProperties);

    const hasNoUnexpectedProperties = propertyNames.
        every((propertyName) => allowedPropertyNames.includes(propertyName));
    const hasNoMissingProperties = allowedPropertyNames.
        every((propertyName) => propertyNames.includes(propertyName));

    return hasNoUnexpectedProperties && hasNoMissingProperties;
};

export const hasValidProperties = (event, props) => {
    const allowedProperties = analyticsEventProperties[event];
    if (!allowedProperties) {
        return props === undefined;
    }
    if (!props || typeof props !== 'object' || Array.isArray(props)) {
        return false;
    }

    if (!hasExpectedPropertyNames(allowedProperties, props)) {
        return false;
    }

    return Object.keys(allowedProperties).
        every((propertyName) => allowedProperties[propertyName].includes(props[propertyName]));
};

export const createPlausiblePayload = (config, event, props) => {
    const path = pageViewPaths[event];
    const payload = {
        domain: config.PLAUSIBLE_DOMAIN,
        name: path ? 'pageview' : event,
        url: `https://${config.PLAUSIBLE_DOMAIN}${path || '/analytics'}`
    };

    if (props) {payload.props = props;}
    return payload;
};

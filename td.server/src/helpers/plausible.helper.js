import {
    analyticsEventNames,
    analyticsEventProperties,
    pageViewPaths
} from '../constants/analyticsEvents.js';

export const isAnalyticsEvent = (event) => analyticsEventNames.includes(event);

export const hasValidProperties = (event, props) => {
    const allowedProperties = analyticsEventProperties[event];
    if (!allowedProperties) {return props === undefined;}
    if (!props || typeof props !== 'object' || Array.isArray(props)) {return false;}

    const propertyNames = Object.keys(props);
    const allowedPropertyNames = Object.keys(allowedProperties);
    if (propertyNames.length !== 1 || propertyNames[0] !== allowedPropertyNames[0]) {return false;}

    return allowedProperties[propertyNames[0]].includes(props[propertyNames[0]]);
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

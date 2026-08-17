import { analyticsEvents, analyticsEventDescriptions } from '@/service/analyticsEvents';

describe('service/analyticsEvents.js', () => {
    it('is a frozen object', () => {
        expect(Object.isFrozen(analyticsEvents)).toBe(true);
        expect(Object.isFrozen(analyticsEventDescriptions)).toBe(true);
    });

    it('contains the expected event keys', () => {
        const keys = [
            'DOCS_LINK_CLICKED',
            'OWASP_LINK_CLICKED',
            'LANGUAGE_CHANGED',
            'LOGIN',
            'LOGOUT',
            'CREATE_NEW_MODEL',
            'OPEN_EXISTING_MODEL',
            'SAVE_MODEL',
            'IMPORT_MODEL',
            'EXPORT_MODEL',
            'GENERATE_REPORT',
            'ADD_DIAGRAM',
            'OPEN_DIAGRAM'
        ];
        keys.forEach(key => {
            expect(analyticsEvents[key]).toBeDefined();
            expect(typeof analyticsEvents[key]).toBe('string');
        });
    });

    it('has a description for each event', () => {
        Object.values(analyticsEvents).forEach(eventName => {
            expect(analyticsEventDescriptions[eventName]).toBeDefined();
            expect(typeof analyticsEventDescriptions[eventName]).toBe('string');
        });
    });
});

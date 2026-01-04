import { CONFIG_CLEAR, CONFIG_FETCH, CONFIG_LOADED, CONFIG_ERROR } from '@/store/actions/config.js';
import configActions from '@/store/actions/config.js';

describe('store/actions/config.js', () => {
    it('defines the clear action', () => {
        expect(CONFIG_CLEAR).not.toBeUndefined();
        expect(typeof CONFIG_CLEAR).toBe('string');
    });

    it('defines the fetch action', () => {
        expect(CONFIG_FETCH).not.toBeUndefined();
        expect(typeof CONFIG_FETCH).toBe('string');
    });

    it('defines the loaded action', () => {
        expect(CONFIG_LOADED).not.toBeUndefined();
        expect(typeof CONFIG_LOADED).toBe('string');
    });

    it('defines the error action', () => {
        expect(CONFIG_ERROR).not.toBeUndefined();
        expect(typeof CONFIG_ERROR).toBe('string');
    });

    it('exports exactly 4 actions under the default export', () => {
        expect(Object.keys(configActions)).toHaveLength(4);
        expect(configActions.clear).toBe(CONFIG_CLEAR);
        expect(configActions.fetch).toBe(CONFIG_FETCH);
        expect(configActions.loaded).toBe(CONFIG_LOADED);
        expect(configActions.error).toBe(CONFIG_ERROR);
    });
});


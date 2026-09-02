jest.mock('@/service/analytics.js', () => ({
    track: jest.fn()
}));

import analytics from '@/service/analytics.js';
import analyticsPlugin from '@/store/analytics.js';

describe('store/analytics.js', () => {
    let after;

    beforeEach(() => {
        jest.clearAllMocks();
        const subscribeAction = jest.fn(({ after: callback }) => { after = callback; });
        analyticsPlugin({ subscribeAction });
    });

    it('tracks a provider selection with its fixed provider key', () => {
        after({ type: 'PROVIDER_SELECTED', payload: 'github' }, {});
        expect(analytics.track).toHaveBeenCalledWith('PROVIDER_SELECTED', { provider: 'github' });
    });

    it('ignores a provider selection outside the allow-list', () => {
        after({ type: 'PROVIDER_SELECTED', payload: 'desktop' }, {});
        expect(analytics.track).not.toHaveBeenCalled();
    });

    it('tracks the resolved application language', () => {
        after({ type: 'LOCALE_SELECTED' }, { locale: { locale: 'pt-BR' } });
        expect(analytics.track).toHaveBeenCalledWith('APPLICATION_LANGUAGE_USED', { language: 'pt-BR' });
    });

    it('tracks a model opened from the selected provider', () => {
        after({ type: 'THREATMODEL_FETCH' }, { provider: { selected: 'google' } });
        expect(analytics.track).toHaveBeenCalledWith('THREAT_MODEL_OPENED', { source: 'google' });
    });

    it('does not report local imports as provider fetches', () => {
        after({ type: 'THREATMODEL_FETCH' }, { provider: { selected: 'local' } });
        expect(analytics.track).not.toHaveBeenCalled();
    });

    it('ignores unrelated actions', () => {
        after({ type: 'THREATMODEL_CLEAR' }, {});
        expect(analytics.track).not.toHaveBeenCalled();
    });
});

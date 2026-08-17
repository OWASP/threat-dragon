import { initPlausible, trackEvent, isInitialized, _resetForTesting } from '@/service/plausible';
import { isDesktopApp } from '@/service/environment';

jest.mock('@/service/environment', () => ({
    isDesktopApp: jest.fn()
}));

describe('service/plausible.js', () => {
    let originalPlausible;

    beforeEach(() => {
        _resetForTesting();
        originalPlausible = window.plausible;
        delete window.plausible;
        isDesktopApp.mockReturnValue(false);
        const scripts = document.head.getElementsByTagName('script');
        for (let i = scripts.length - 1; i >= 0; i--) {
            if (scripts[i].src.includes('plausible')) {
                scripts[i].remove();
            }
        }
    });

    afterEach(() => {
        window.plausible = originalPlausible;
        jest.clearAllMocks();
    });

    it('does not initialize if config is missing or disabled', () => {
        initPlausible(null);
        expect(isInitialized()).toBe(false);

        initPlausible({ enabled: false });
        expect(isInitialized()).toBe(false);
    });

    it('does not initialize in desktop app environment', () => {
        isDesktopApp.mockReturnValue(true);
        initPlausible({ enabled: true, domain: 'example.com' });
        expect(isInitialized()).toBe(false);
    });

    it('does not initialize if domain is missing', () => {
        const consoleWarn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        initPlausible({ enabled: true, url: 'https://plausible.io' });
        expect(isInitialized()).toBe(false);
        expect(consoleWarn).toHaveBeenCalled();
        consoleWarn.mockRestore();
    });

    it('injects script tag and sets up window.plausible function on success', () => {
        initPlausible({ enabled: true, domain: 'example.com', url: 'https://analytics.example.com' });
        expect(isInitialized()).toBe(true);

        const scripts = Array.from(document.head.getElementsByTagName('script'));
        const plausibleScript = scripts.find(s => s.src.includes('plausible') || s.src.includes('analytics.example.com'));
        expect(plausibleScript).toBeDefined();
        expect(plausibleScript.getAttribute('data-domain')).toBe('example.com');
        expect(plausibleScript.defer).toBe(true);

        expect(typeof window.plausible).toBe('function');
    });

    it('uses default plausible url if none provided', () => {
        initPlausible({ enabled: true, domain: 'example.com' });
        const scripts = Array.from(document.head.getElementsByTagName('script'));
        const plausibleScript = scripts.find(s => s.src.includes('plausible.io'));
        expect(plausibleScript).toBeDefined();
    });

    it('does not re-initialize if already initialized', () => {
        initPlausible({ enabled: true, domain: 'example.com' });
        const initialCount = Array.from(document.head.getElementsByTagName('script')).filter(s => s.src.includes('plausible')).length;

        initPlausible({ enabled: true, domain: 'example.com' });
        const postCount = Array.from(document.head.getElementsByTagName('script')).filter(s => s.src.includes('plausible')).length;

        expect(postCount).toBe(initialCount);
    });

    it('tracks events if initialized', () => {
        initPlausible({ enabled: true, domain: 'example.com' });
        const mockPlausible = jest.fn();
        window.plausible = mockPlausible;

        trackEvent('test_event');
        expect(mockPlausible).toHaveBeenCalledWith('test_event');

        trackEvent('test_event_with_props', { foo: 'bar' });
        expect(mockPlausible).toHaveBeenCalledWith('test_event_with_props', { props: { foo: 'bar' } });
    });

    it('does not track events if not initialized', () => {
        const mockPlausible = jest.fn();
        window.plausible = mockPlausible;

        trackEvent('test_event');
        expect(mockPlausible).not.toHaveBeenCalled();
    });
});

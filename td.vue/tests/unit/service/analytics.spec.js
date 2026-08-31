jest.mock('@/service/api/api.js', () => ({
    postAsync: jest.fn()
}));

import api from '@/service/api/api.js';
import analytics, { durationBucket } from '@/service/analytics.js';

describe('service/analytics.js', () => {
    const config = {
        enabled: true,
        dashboardUrl: 'https://plausible.test/share/threatdragon',
        eventNames: ['PAGE_VIEW_HOME', 'THREAT_MODEL_EDIT_SESSION_ENDED']
    };

    beforeEach(() => {
        analytics.disable();
        api.postAsync.mockReset();
        api.postAsync.mockResolvedValue({});
    });

    it('does not send while disabled', async () => {
        await analytics.track('PAGE_VIEW_HOME');
        expect(api.postAsync).not.toHaveBeenCalled();
    });

    it('rejects incomplete configuration', () => {
        expect(analytics.configure({ enabled: true, eventNames: [] })).toBe(false);
    });

    it('rejects a malformed dashboard URL', () => {
        expect(analytics.configure({
            enabled: true,
            dashboardUrl: 'not-a-url',
            eventNames: ['PAGE_VIEW_HOME']
        })).toBe(false);
    });

    it('rejects a dashboard URL with an unsafe protocol', () => {
        expect(analytics.configure({
            enabled: true,
            dashboardUrl: 'javascript:alert(1)',
            eventNames: ['PAGE_VIEW_HOME']
        })).toBe(false);
    });

    it('rejects an enabled configuration that has no usable events', () => {
        expect(analytics.configure({
            enabled: true,
            dashboardUrl: 'http://plausible.test/share/threatdragon',
            eventNames: []
        })).toBe(false);
    });

    it('rejects a configuration with invalid event names', () => {
        expect(analytics.configure({
            enabled: true,
            dashboardUrl: 'https://plausible.test/share/threatdragon',
            eventNames: 'PAGE_VIEW_HOME'
        })).toBe(false);
    });

    it('ignores non-string entries in the server allow-list', async () => {
        analytics.configure({ ...config, eventNames: [null, 'PAGE_VIEW_HOME'] });
        await analytics.track('PAGE_VIEW_HOME');
        expect(api.postAsync).toHaveBeenCalledTimes(1);
    });

    it('sends allowlisted events to the same-origin endpoint', async () => {
        analytics.configure(config);
        await analytics.track('PAGE_VIEW_HOME');
        expect(api.postAsync).toHaveBeenCalledWith('/api/analytics', { event: 'PAGE_VIEW_HOME' });
    });

    it('sends fixed event properties to the same-origin endpoint', async () => {
        analytics.configure(config);
        await analytics.track('THREAT_MODEL_EDIT_SESSION_ENDED', {
            duration_bucket: 'LESS_THAN_5_MINUTES'
        });
        expect(api.postAsync).toHaveBeenCalledWith('/api/analytics', {
            event: 'THREAT_MODEL_EDIT_SESSION_ENDED',
            props: { duration_bucket: 'LESS_THAN_5_MINUTES' }
        });
    });

    it('does not send unknown events', async () => {
        analytics.configure(config);
        await analytics.track('THREAT_MODEL_NAME');
        expect(api.postAsync).not.toHaveBeenCalled();
    });

    it('reports successful analytics delivery', async () => {
        analytics.configure(config);
        await expect(analytics.track('PAGE_VIEW_HOME')).resolves.toBe(true);
    });

    it('absorbs analytics delivery errors', async () => {
        analytics.configure(config);
        api.postAsync.mockRejectedValue(new Error('offline'));
        await expect(analytics.track('PAGE_VIEW_HOME')).resolves.toBe(false);
    });

    it.each([
        [0, 'LESS_THAN_5_MINUTES'],
        [5 * 60 * 1000, 'FIVE_TO_FIFTEEN_MINUTES'],
        [15 * 60 * 1000, 'FIFTEEN_TO_THIRTY_MINUTES'],
        [30 * 60 * 1000, 'THIRTY_TO_SIXTY_MINUTES'],
        [60 * 60 * 1000, 'SIXTY_PLUS_MINUTES']
    ])('uses fixed duration bucket %s', (duration, expected) => {
        expect(durationBucket(duration)).toBe(expected);
    });

    it('does not start an edit session while disabled', () => {
        expect(analytics.startEditing(1000)).toBe(false);
    });

    it('starts one edit session', () => {
        analytics.configure(config);
        expect(analytics.startEditing(1000)).toBe(true);
    });

    it('does not start a second editing session', () => {
        analytics.configure(config);
        analytics.startEditing(1000);
        expect(analytics.startEditing(2000)).toBe(false);
    });

    it('uses the current time when starting an edit session', () => {
        analytics.configure(config);
        expect(analytics.startEditing()).toBe(true);
    });

    it('does not finish a session that was not started', () => {
        analytics.configure(config);
        expect(analytics.finishEditing(2000)).toBe(false);
    });

    it('tracks a completed edit session once', () => {
        analytics.configure(config);
        analytics.startEditing(1000);
        expect(analytics.finishEditing(2000)).toBe(true);
    });

    it('clamps a negative edit duration to the first bucket', async () => {
        analytics.configure(config);
        analytics.startEditing(2000);
        analytics.finishEditing(1000);
        await Promise.resolve();
        expect(api.postAsync).toHaveBeenCalledWith('/api/analytics', {
            event: 'THREAT_MODEL_EDIT_SESSION_ENDED',
            props: { duration_bucket: 'LESS_THAN_5_MINUTES' }
        });
    });

    it('uses the current time when finishing an edit session', () => {
        analytics.configure(config);
        analytics.startEditing(1000);
        expect(analytics.finishEditing()).toBe(true);
    });

    it('clears an edit session after it finishes', () => {
        analytics.configure(config);
        analytics.startEditing(1000);
        analytics.finishEditing(2000);
        expect(analytics.finishEditing(3000)).toBe(false);
    });

    it('ends editing when the page is hidden', () => {
        analytics.configure(config);
        analytics.startEditing(1000);
        window.dispatchEvent(new Event('pagehide'));
        expect(analytics.finishEditing(2000)).toBe(false);
    });
});

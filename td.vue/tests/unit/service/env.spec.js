import env from '@/service/env.js';

describe('service/env.js', () => {
    let uaGetter;

    beforeEach(() => {
        uaGetter = jest.spyOn(window.navigator, 'userAgent', 'get');
    });

    it('detects an electron user agent', () => {
        uaGetter.mockReturnValue('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) SiteKiosk/1.0.0 Chrome/94.0.4606.81 Electron/15.3.1 Safari/537.36');
        expect(env.isElectron()).toEqual(true);
    });

    it('determines it is not electron', () => {
        uaGetter.mockReturnValue('Mozilla/5.0 (Android 4.4; Mobile; rv:41.0) Gecko/41.0 Firefox/41.0');
        expect(env.isElectron()).toEqual(false);
    });
});

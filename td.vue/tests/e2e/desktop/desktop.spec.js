// TODO: very basic tests, and there should be many more tests than this

import { browser } from '@wdio/globals';

describe('Desktop application', () => {

    describe('main window', () => {
        it('should launch the application', async () => {
            const title = await browser.getTitle();
            expect(title).toEqual('OWASP Threat Dragon');
        });

        it('should have an electron url', async () => {
            let url = await browser.getUrl();
            expect(url).toEqual('app://./index.html');
        });

    });

});

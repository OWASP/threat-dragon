/* eslint-disable no-undef */
describe('Desktop application', () => {

    describe('main window', () => {
        it('should launch the application', async () => {
            const title = await browser.getTitle();
            expect(title).toEqual('OWASP Threat Dragon');
        });

        it('should set the window size', async () => {
            let bounds = await browser.electronBrowserWindow('getBounds');
            expect(bounds.width).toEqual(200);
            expect(bounds.height).toEqual(300);
        });
    });

});

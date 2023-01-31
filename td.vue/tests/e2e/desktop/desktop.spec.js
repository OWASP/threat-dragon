/* eslint-disable no-undef */
describe('Desktop application loading', () => {

    describe('Desktop main window', () => {
        it('should launch the application', async () => {
            const title = await browser.getTitle();
            expect(title).toEqual('OWASP Threat Dragon');
        });

        it.skip('should set the window to default size', async () => {
            let bounds = await browser.electronBrowserWindow('getBounds');
            expect(bounds.width).toEqual(200);
            expect(bounds.height).toEqual(300);
        });
    });

});

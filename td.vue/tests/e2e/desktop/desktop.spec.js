/* eslint-disable no-undef */
describe('Desktop application loading', () => {

    describe('Desktop main window', () => {
        it('should launch the application', async () => {
            const title = await browser.getTitle();
            expect(title).toEqual('OWASP Threat Dragon');
        });
    });

});

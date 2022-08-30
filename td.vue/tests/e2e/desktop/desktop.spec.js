/* eslint-disable no-undef */
describe('application loading', () => {
    describe('App', () => {
        it('should launch the application', async () => {
            const title = await browser.getTitle();
            expect(title).toEqual('OWASP Threat Dragon');
        });
    });
});

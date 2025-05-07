describe('print', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
        // Use the list-group-item that contains the text instead of a direct link
        cy.get('.list-group-item').contains('Demo Threat Model').click();
    });

    it('can report on the model', () => {
        // Check for the report button
        cy.get('#td-report-btn').should('be.visible');
        cy.get('#td-report-btn').click();
    });

    // TODO: skip this test because it fails on Firefox but not Chrome
    it.skip('can print the model', () => {
        cy.get('#td-report-btn').click();
        cy.window().then((win) => {
            cy.stub(win, 'print').as('print');
        });
        // Check that we're on the report page
        cy.url().should('include', 'report');
        cy.get('#td-print-btn').click({ force: true });
        cy.get('@print').should('have.been.calledOnce');
    });
});

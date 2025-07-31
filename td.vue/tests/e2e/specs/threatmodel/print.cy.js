describe('print', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
        cy.get('a').contains('Demo Threat Model').click();
    });

    it('can report on the model', () => {
        cy.contains('High level system description');
        cy.get('button').contains('Report').click();
    });

    // TODO: skip this test because it fails on Firefox but not Chrome
    it.skip('can print the model', () => {
        cy.get('button').contains('Report').click();
        cy.window().then((win) => {
            cy.stub(win, 'print').as('print');
        });
        cy.contains('High level system description');
        cy.get('#td-print-btn').click({ force: true });
        cy.get('@print').should('have.been.calledOnce');
    });

});

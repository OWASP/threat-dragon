describe('closing a threat model', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
        cy.get('a[data-model-name="Demo Threat Model"').click();
        cy.url().should('contain', '/local/Demo%20Threat%20Model');
        cy.contains('Demo Threat Model');
    });

    describe('Close', () => {
        it('goes back without prompting if data has not been edited', () => {
            cy.get('#td-close-btn').click();
            cy.url().should('equal', Cypress.config().baseUrl + '#/dashboard');
        });
    });

});

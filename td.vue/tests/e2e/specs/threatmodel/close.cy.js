describe('closing a threat model', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
        // Use the list-group-item that contains the text instead of data-model-name attribute
        cy.get('.list-group-item').contains('Demo Threat Model').click();
        // following path might need to be "/models/..."
        cy.url().should('contain', '/local/Demo%20Threat%20Model');
    });

    describe('Close', () => {
        it('goes back without prompting if data has not been edited', () => {
            cy.get('#td-close-btn').click();
            cy.url().should('equal', Cypress.config().baseUrl + '#/dashboard');
        });
    });
});

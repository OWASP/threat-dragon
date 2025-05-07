describe('closing a threat model', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
        // Use the list-group-item that contains the text instead of data-model-name attribute
        cy.get('.list-group-item').contains('Demo Threat Model').click();
        // Updated path to match new URL structure
        cy.url().should('contain', '/models/Demo%20Threat%20Model');
    });

    describe('Close', () => {
        it('goes back without prompting if data has not been edited', () => {
            cy.get('#td-close-btn').click();
            // After closing, we should be redirected to the dashboard
            cy.url().should('include', '/dashboard');
        });
    });
});

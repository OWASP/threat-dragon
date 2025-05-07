describe('login', () => {
    describe('local login', () => {
        it('logs in using the local storage option', () => {
            cy.get('#local-login-btn').click();
            
            // Check for the logged-in-as element with the username
            cy.get('.logged-in-as').should('be.visible');
            cy.get('.logged-in-as').should('contain', 'Local Session');
            
            // Verify we're redirected to the dashboard
            cy.url().should('contain', '/dashboard');
        });
    });
});

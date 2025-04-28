describe('logout', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        // Check for the logged-in-as element with the username
        cy.get('.logged-in-as').should('be.visible');
        cy.get('.logged-in-as').should('contain', 'Local Session');
        cy.get('#nav-sign-out').click();
    });

    it('does not show the logged in text', () => {
        cy.get('.logged-in-as').should('not.be','visible');
    });

    it('should redirect to the home page', () => {
        cy.url().should('contain', '/#/');
    });
});

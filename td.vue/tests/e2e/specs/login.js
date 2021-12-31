describe('login', () => {
    beforeEach(() => {
        cy.visit('/');
        cy.get('.Vue-Toastification__close-button').click();
    });

    describe('local login', () => {
        it('logs in using the local storage option', () => {
            cy.get('#local-login-btn').click();
            cy.contains('Logged in as Guest');
            cy.url().should('contain', '/dashboard');
        });
    });
});

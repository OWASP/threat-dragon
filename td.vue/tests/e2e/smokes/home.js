describe('home', () => {
    before(() => {
        cy.visit('/');
    });

    it('has a welcome message', () => {
        cy.contains('OWASP Threat Dragon');
    });

    it('describes the application', () => {
        cy.contains('open-source threat modeling tool');
    });

    it('shows the threat dragon logo', () => {
        cy.get('#home-td-logo').should('be.visible');
    });

    it('displays the login options', () => {
        cy.get('#local-login-btn').should('be.visible');
    });

    it('has a v2 warning toast', () => {
        cy.get('.Vue-Toastification__toast--error').should('be.visible');
        cy.get('.Vue-Toastification__close-button').click();
    });
});

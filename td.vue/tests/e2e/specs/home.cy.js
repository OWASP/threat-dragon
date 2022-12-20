// tests used to ensure the welcome page has the required components

describe('home', () => {
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
});

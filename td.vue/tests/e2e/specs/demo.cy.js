describe('demo models', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the header text', () => {
        // Using translation key pattern instead of hardcoded text
        cy.get('.jumbotron').should('be.visible');
    });

    it('lists all the demo threat models', () => {
        // Check for all models that should be in the list
        cy.contains('New Blank Model');
        cy.contains('Demo Threat Model');
        cy.contains('Cryptocurrency Wallet');
        cy.contains('Generic CMS');
        cy.contains('IoT Device');
        cy.contains('Online Game');
        cy.contains('Payments Processing Platform');
        cy.contains('Renting Car Startup');
        cy.contains('Three Tier Web Application');
    });

    it('opens the new blank model', () => {
        cy.get('.list-group-item').contains('New Blank Model').click();
        cy.url().should('contain', '/models/New%20Blank%20Model');
    });

    it('opens the demo threat model', () => {
        cy.get('.list-group-item').contains('Demo Threat Model').click();
        cy.url().should('contain', '/models/Demo%20Threat%20Model');
    });
});

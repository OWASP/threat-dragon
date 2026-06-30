describe('print', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the header text', () => {
        cy.contains('demo threat model from the list');
    });

    it('lists the Threat Models', () => {
        cy.contains('New Blank Model');
        cy.contains('Demo Threat Model');
    });

    it('opens the new threat model', () => {
        cy.get('a').contains('New Blank Model').click();
        cy.url().should('contain', '/local/New%20Blank%20Model');
    });

    it('opens the demo threat model', () => {
        cy.get('a').contains('Demo Threat Model').click();
        cy.url().should('contain', '/local/Demo%20Threat%20Model');
    });

    it('opens a TM-BOM format threat model', () => {
        cy.get('a').contains('Husky AI').click();
        cy.url().should('contain', '/local/Husky%20AI');
    });

    it('opens an OTM format threat model', () => {
        cy.get('a').contains('Mobile to Public Cloud').click();
        cy.url().should('contain', '/local/Mobile%20to%20Public%20Cloud');
    });
});

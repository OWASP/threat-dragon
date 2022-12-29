describe('print', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the header text', () => {
        cy.contains('demo threat model from the list');
    });

    it('lists the Threat Models', () => {
        cy.contains('New Threat Model');
        cy.contains('Demo Threat Model');
        cy.contains('Version 2 New Model');
        cy.contains('Version 2 Demo Model');
    });

    // TODO: navigation guard error
    it.skip('opens the v1 new threat model', () => {
        cy.get('a').contains('New Threat Model').click();
        cy.url().should('contain', '/local/New%20Threat%20Model');
    });

    // TODO: navigation guard error
    it.skip('opens the v1 demo threat model', () => {
        cy.get('a').contains('Demo Threat Model').click();
        cy.url().should('contain', '/local/Demo%20Threat%20Model');
    });

    it('opens the v2 new threat model', () => {
        cy.get('a').contains('Version 2 New Model').click();
        cy.url().should('contain', '/local/Version%202%20New%20Model');
    });

    it('opens the v2 demo threat model', () => {
        cy.get('a').contains('Version 2 Demo Model').click();
        cy.url().should('contain', '/local/Version%202%20Demo%20Model');
    });

});

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
        cy.contains('.list-group-item', 'New Blank Model').click();
        cy.url().should('contain', '/local/New%20Blank%20Model');
    });

    it('opens the demo threat model', () => {
        cy.contains('.list-group-item', 'Demo Threat Model').click();
        cy.url().should('contain', '/local/Demo%20Threat%20Model');
    });

});

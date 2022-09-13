describe('demo', () => {
    before(() => {
        cy.setupTest();
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the header text', () => {
        cy.contains('demo threat model from the list');
    });

    it('has the New Threat Model', () => {
        cy.contains('New Threat Model');
    });

    it('has the Demo Threat Model', () => {
        cy.contains('Demo Threat Model');
    });

    it('has the V2 New Model', () => {
        cy.contains('Version 2 New Model');
    });

    it('opens the v2 demo threat model', () => {
        cy.get('a').contains('Version 2 Demo Model').click();
        cy.url().should('contain', '/local/Version%202%20Demo%20Model');
    });

    it('can edit the model', () => {
        cy.get('#tm-edit-btn').click();
        cy.url().should('contain', '/edit');
        cy.get('#description').should('be.visible');
        cy.get('button').contains('Cancel').click();
    });

    it('can edit the diagram', () => {
        cy.get('.td-diagram-thumb').click();
        cy.url().should('contain', '/edit/Main%20Request%20Data%20Flow');
    });

});

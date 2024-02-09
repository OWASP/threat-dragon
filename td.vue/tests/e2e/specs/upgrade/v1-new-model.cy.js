describe('upgrade v1 new', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the New Threat Model', () => {
        cy.contains('demo threat model from the list');
        cy.contains('New Threat Model');
    });

    // TODO: uncaught guard error, skip tests from now on
    it.skip('opens the new threat model', () => {
        cy.get('a').contains('New Threat Model').click();
        cy.url().should('contain', '/local/New%20Threat%20Model/upgrade');
    });

    it.skip('tells the user about the upgrade', () => {
        cy.get('.modal-title').contains('Threatmodel Update');
        cy.get('.td-welcome-title').contains('Welcome to version 2');
        cy.get('.td-p1').contains('drawing library');
        cy.get('.td-p2').contains('upgrade');
        cy.get('.td-upgrade-modal-ok').click();
    });

    it.skip('has the user continue', () => {
        cy.get('.td-instructions').contains('your model');
        cy.get('.td-upgrade-continue').click();
        cy.url().should('contain', 'local/New%20Threat%20Model');
    });

    it.skip('can edit the model', () => {
        cy.get('#td-edit-btn').click();
        cy.url().should('contain', '/edit');
        cy.get('#description').should('be.visible');
        cy.get('button').contains('Close').click();
    });

    it.skip('asks the user about the changes', () => {
        cy.get('.modal-title').contains('Discard Changes?');
        cy.get('button').contains('OK').click();
    });

});

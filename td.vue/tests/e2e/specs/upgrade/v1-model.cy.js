describe('upgrade v1 demo', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the Demo Threat Model', () => {
        cy.contains('demo threat model from the list');
        cy.contains('Demo Threat Model');
    });

    // TODO: uncaught guard error, skip tests from now on
    it.skip('opens the demo threat model', () => {
        cy.get('a').contains('Demo Threat Model').click();
        cy.url().should('contain', '/local/Demo%20Threat%20Model/upgrade');
    });

    it.skip('tells the user about the upgrade', () => {
        cy.get('.modal-title').contains('Threatmodel Update');
        cy.get('.td-welcome-title').contains('Welcome to version 2');
        cy.get('.td-p1').contains('drawing library');
        cy.get('.td-p2').contains('upgrade');
        cy.get('.td-upgrade-modal-ok').click();
    });

    it.skip('shows each diagram', () => {
        cy.get('.td-diagram-title').contains('Main Request Data Flow');
        cy.get('.td-readonly-diagram').should('be.visible');
    });

    it.skip('can edit a diagram', () => {
        cy.get('.td-diagram-edit-btn').click();
        cy.url().should('contain', 'local/Demo%20Threat%20Model/edit/Main%20Request%20Data%20Flow');
        cy.go('back');
        cy.get('.td-upgrade-modal-ok').click();
    });

    it.skip('has the user continue', () => {
        cy.get('.td-instructions').contains('your model');
        cy.get('.td-upgrade-continue').click();
        cy.url().should('contain', 'local/Demo%20Threat%20Model');
    });

    it.skip('can edit the model', () => {
        cy.get('#td-edit-btn').click();
        cy.url().should('contain', '/edit');
        cy.get('#description').should('be.visible');
        cy.get('button').contains('Close').click();
    });

    it.skip('can edit the diagram', () => {
        cy.get('.td-diagram-thumb').click();
        cy.url().should('contain', '/edit/Main%20Request%20Data%20Flow');
    });

});

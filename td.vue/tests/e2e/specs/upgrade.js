describe('upgrade', () => {
    before(() => {
        cy.visit('/');
        cy.get('.Vue-Toastification__close-button').click();
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the header text', () => {
        cy.contains('demo threat model from the list');
    });

    it('has the Demo Threat Model', () => {
        cy.contains('Demo Threat Model');
    });

    it('has the legacy desktop model', () => {
        cy.contains('Legacy Desktop Model');
    });

    it('has the Legacy Model', () => {
        cy.contains('Legacy Model');
    });

    it('opens the demo threat model', () => {
        cy.get('a').contains('Demo Threat Model').click();
        cy.url().should('contain', '/local/Demo%20Threat%20Model/upgrade');
    });

    it('tells the user about the upgrade', () => {
        cy.get('.modal-title').contains('Threatmodel Update');
        cy.get('.td-welcome-title').contains('Welcome to version 2');
        cy.get('.td-p1').contains('drawing library');
        cy.get('.td-p2').contains('upgrade');
        cy.get('.td-upgrade-modal-ok').click();
    });

    it('shows each diagram', () => {
        cy.get('.td-diagram-title').contains('Main Request Data Flow');
        cy.get('.td-readonly-diagram').should('be.visible');
    });

    it('can edit a diagram', () => {
        cy.get('.td-diagram-edit-btn').click();
        cy.url().should('contain', 'local/Demo%20Threat%20Model/edit/Main%20Request%20Data%20Flow');
        cy.go('back');
        cy.get('.td-upgrade-modal-ok').click();
    });

    it('has the user continue', () => {
        cy.get('.td-instructions').contains('your model');
        cy.get('.td-upgrade-continue').click();
        cy.url().should('contain', 'local/Demo%20Threat%20Model');
    });

});

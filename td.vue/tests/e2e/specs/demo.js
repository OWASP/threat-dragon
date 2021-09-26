describe('demo', () => {
    before(() => {
        cy.visit('/');
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
        cy.url().should('contain', '/local/Demo%20Threat%20Model');
    });

    it('can edit the model', () => {
        cy.get('#tm-edit-btn').click();
        cy.url().should('contain', '/local/Demo%20Threat%20Model/edit');
        cy.get('#description').should('be', 'visible');
        cy.get('button').contains('Cancel').click();
    });

    it('can edit the diagram', () => {
        cy.get('.td-diagram-thumb').click();
        cy.url().should('contain', '/edit/Main%20Request%20Data%20Flow');
    });

});

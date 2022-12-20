describe('print', () => {
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

    it('can report on the model', () => {
        cy.contains('High level system description');
        cy.get('button').contains('Report').click();
    });

    it('can print the model', () => {
        cy.window().then((win) => {
            cy.stub(win, 'print').as('print');
        });
        cy.contains('High level system description');
        cy.get('#td-print-btn').click({ force: true });
        cy.get('@print').should('have.been.calledOnce');
    });

});

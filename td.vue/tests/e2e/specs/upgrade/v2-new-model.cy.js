describe('upgrade v2 new', () => {
    before(() => {
        cy.setupTest();
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the header text', () => {
        cy.contains('demo threat model from the list');
    });

    it('has the V2 New Model', () => {
        cy.contains('Version 2 New Model');
    });

    it('opens the v2 new threat model', () => {
        cy.get('a').contains('Version 2 New Model').click();
        cy.url().should('contain', '/local/Version%202%20New%20Model');
    });

    it('can edit the model', () => {
        cy.get('#td-edit-btn').click();
        cy.url().should('contain', '/edit');
        cy.get('#description').should('be.visible');
        cy.get('button').contains('Cancel').click();
    });

});

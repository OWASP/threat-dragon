describe('upgrade v2 new', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the V2 New Model', () => {
        // Check for the demo model in the list
        cy.get('.jumbotron').should('be.visible');
        // "New Blank Model" might need to be changed to "Demo Threat Model"
        cy.get('.list-group-item').contains('New Blank Model').should('be.visible');
    });

    it('opens the v2 new threat model', () => {
        cy.get('.list-group-item').contains('New Blank Model').click();
        cy.url().should('contain', '/local/New%20Blank%20Model');
    });

    it('can edit the model', () => {
        cy.get('.list-group-item').contains('New Blank Model').click();
        cy.get('#td-edit-btn').click();
        cy.url().should('contain', '/edit');
        cy.get('#description').should('be.visible');
        cy.get('#td-close-btn').click();
    });
});

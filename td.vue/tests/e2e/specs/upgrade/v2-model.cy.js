describe('upgrade v2 demo', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
    });

    it('has the V2 Demo Model', () => {
        // Check for the demo model in the list
        cy.get('.jumbotron').should('be.visible');
        cy.get('.list-group-item').contains('Demo Threat Model').should('be.visible');
    });

    it('opens the v2 demo threat model', () => {
        cy.get('.list-group-item').contains('Demo Threat Model').click();
        cy.url().should('contain', '/models/Demo%20Threat%20Model');
    });

    it('can edit the model', () => {
        cy.get('.list-group-item').contains('Demo Threat Model').click();
        cy.get('#td-edit-btn').click();
        cy.url().should('contain', '/edit');
        cy.get('#description').should('be.visible');
        cy.get('#td-close-btn').click();
    });

    it('can edit the diagram', () => {
        cy.get('.list-group-item').contains('Demo Threat Model').click();
        cy.get('.td-diagram-thumb').click();
        // Use more flexible matching for the diagram edit URL
        cy.url().should('include', '/edit/').and('include', 'Request');
    });
});

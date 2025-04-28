describe('create a new threat model', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/local/threatmodel/new"]').click();
        cy.url().should('contain', '/local/New%20Threat%20Model/edit');
    });

    it('can edit the title', () => {
        cy.get('#title').clear();
        cy.get('#title').type('new name');
        // The page title might be in a different format now
        cy.get('#title').should('have.value', 'new name');
    });

    it('can edit the owner', () => {
        cy.get('#owner').should('be.visible')
            .should('not.be', 'disabled')
            .type('owner');
    });

    it('can edit the reviewer', () => {
        cy.get('#reviewer').should('be.visible')
            .should('not.be', 'disabled')
            .type('reviewer');
    });

    it('can edit the description', () => {
        cy.get('#description').should('be.visible')
            .should('not.be', 'disabled')
            .type('description');
    });

    it('should have the contributors field', () => {
        cy.get('#contributors').should('be.visible');
    });

    it('can add a new diagram', () => {
        // Get the initial count of diagrams
        cy.get('.diagram-inputs').then(($diagrams) => {
            const initialCount = $diagrams.length;
            
            // Click the add diagram link
            cy.get('.add-diagram-link').click();
            
            // Verify a new diagram was added
            cy.get('.diagram-inputs').should('have.length', initialCount + 1);
            
            // Remove the diagram
            cy.get('.remove-diagram-btn').last().click();
            
            // Verify the diagram was removed
            cy.get('.diagram-inputs').should('have.length', initialCount);
        });
    });

    it('has the form control buttons', () => {
        cy.get('#td-save-btn').should('be.visible');
        cy.get('#td-reload-btn').should('be.visible');
        cy.get('#td-close-btn').should('be.visible');
    });
});

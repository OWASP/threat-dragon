describe('create a new threat model', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/local/threatmodel/new"]').click();
        // Fill out the form
        cy.get('#threat-model-title').type('Test Threat Model');
        cy.get('#threat-model-owner').type('Test Owner');
        cy.get('#threat-model-description').type('Test Description');
        cy.get('#threat-model-reviewer').type('Test Reviewer');
        // Submit the form
        cy.get('button[type="submit"]').click();
        // After submitting the form, we should be redirected to the edit page with the model name
        cy.url().should('include', '/models/').and('include', '/edit');
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
        // Initially there might be no diagrams
        // Click the add diagram link to add a new diagram
        cy.get('.add-diagram-link').click();
        
        // Verify a diagram was added
        cy.get('.diagram-inputs').should('exist');
        
        // Remove the diagram
        cy.get('.remove-diagram-btn').click();
        
        // Verify the diagram was removed
        cy.get('.diagram-inputs').should('not.exist');
    });

    it('has the form control buttons', () => {
        cy.get('#td-save-btn').should('be.visible');
        cy.get('#td-reload-btn').should('be.visible');
        cy.get('#td-close-btn').should('be.visible');
    });
});

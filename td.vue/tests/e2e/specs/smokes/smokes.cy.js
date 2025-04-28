// quick test to see if the edit page is accessible

describe('smoke tests', () => {
    describe('login', () => {
        it('has a welcome message', () => {
            cy.contains('OWASP Threat Dragon');
        });
    
        it('always displays local login option', () => {
            cy.get('#local-login-btn').should('be.visible');
        });
    });

    describe('create and edit', () => {
        beforeEach(() => {
            cy.get('#local-login-btn').click();
            // Wait for the dashboard to load and the "Create a new, empty threat model" link to appear
            cy.contains('Create a new, empty threat model', { timeout: 10000 }).should('be.visible');
            // Click the "Create a new, empty threat model" link
            cy.contains('Create a new, empty threat model').click();
            // Check that we're on the new threat model page
            cy.url().should('contain', '/local/threatmodel/new');
            // Wait for the form to load and fill in the title field
            cy.get('#threat-model-title').should('be.visible');
            cy.get('#threat-model-title').clear();
            cy.get('#threat-model-title').type('new name');
            // Save the model
            cy.contains('Save').click();
            // Check that we're on the edit page
            cy.url().should('contain', '/models/new%20name/edit');
        });
    
        it('can edit the title', () => {
            // The title should already be set to "new name" from the beforeEach hook
            cy.get('#title').should('have.value', 'new name');
        });
    
        it('can add a new diagram', () => {
            cy.get('.add-diagram-link').should('be.visible').click();
            // After clicking add diagram, there should be at least one diagram input group
            cy.get('.diagram-inputs').should('be.visible');
            // Click the remove button
            cy.get('.remove-diagram-btn').first().click();
            // Check that the diagram was removed
            cy.get('.diagram-inputs').should('not.exist');
        });
    
        it('has the close control buttons', () => {
            cy.get('#td-close-btn').should('be.visible');
        });
    });
});

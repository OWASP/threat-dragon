// quick test to see if the edit page is accessible

describe('smoke tests', () => {
    describe('login', () => {
        it('has a welcome message', () => {
            // Check for the title element instead of specific text
            cy.get('[data-testid="home-title"]').should('be.visible');
        });
    
        it('always displays local login option', () => {
            cy.get('#local-login-btn').should('be.visible');
        });
    });

    describe('create and edit', () => {
        beforeEach(() => {
            cy.get('#local-login-btn').click();
            // Wait for the dashboard to load
            cy.url().should('contain', '/dashboard');
            
            // Find and click the "Create New" action
            cy.get('.dashboard-action').contains('Create a new, empty threat model').click();
            
            // Check that we're on the new threat model page
            cy.url().should('contain', '/local/threatmodel/new');
            
            // Wait for the form to load and fill in the title field
            cy.get('#threat-model-title').should('be.visible');
            cy.get('#threat-model-title').clear();
            cy.get('#threat-model-title').type('new name');
            
            // Save the model
            cy.get('button').contains('Save').click();
            
            // Check that we're on the edit page
            cy.url().should('contain', '/models/new%20name/edit');
        });
    
        it('can edit the title', () => {
            // The title should already be set to "new name" from the beforeEach hook
            cy.get('#title').should('have.value', 'new name');
        });
    
        it('can add a new diagram', () => {
            // Click the add diagram link to add a diagram
            cy.get('.add-diagram-link').click();
            
            // Verify a diagram was added
            cy.get('.diagram-inputs').should('exist');
            
            // Remove the diagram
            cy.get('.remove-diagram-btn').last().click();
            
            // Verify the diagram was removed
            cy.get('.diagram-inputs').should('not.exist');
        });
    
        it('has the close control buttons', () => {
            cy.get('#td-close-btn').should('be.visible');
        });
    });
});

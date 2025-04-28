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
            cy.get('.dashboard-action').contains('createNew').click();
            
            // Check that we're on the new threat model page
            cy.url().should('contain', '/local/threatmodel/new');
            
            // Wait for the form to load and fill in the title field
            cy.get('#title').should('be.visible');
            cy.get('#title').clear();
            cy.get('#title').type('new name');
            
            // Save the model
            cy.get('#td-save-btn').click();
            
            // Check that we're on the edit page
            cy.url().should('contain', '/models/new%20name/edit');
        });
    
        it('can edit the title', () => {
            // The title should already be set to "new name" from the beforeEach hook
            cy.get('#title').should('have.value', 'new name');
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
    
        it('has the close control buttons', () => {
            cy.get('#td-close-btn').should('be.visible');
        });
    });
});

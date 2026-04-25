describe('import', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/local/threatmodel/import"]').click();
        cy.url().should('contain', '/local/threatmodel/import');
    });

    describe('navigating to the import page', () => {
        it('has the title', () => {
            cy.contains('Import a threat model via JSON');
        });

        it('has the buttons visible', () => {
            cy.get('#td-open-btn').should('be.visible');
            cy.get('#td-import-btn').should('be.visible');
        });
    });

    describe('using invalid JSON', () => {
        it('shows an error when there is invalid JSON', () => {
            cy.get('#json-input').type('some bad stuff');
            cy.get('#td-import-btn').click();
            cy.contains('Invalid JSON');
        });
    });

    describe('using a valid V1 model without diagram', () => {
        it('upgrades from v1 to v2', () => {
            cy.fixture('v1-new-model').then((model) => {
                cy.get('#json-input').type(JSON.stringify(model), {parseSpecialCharSequences: false});
            });
            cy.get('#td-import-btn').click();
            cy.url().should('contain', '/local/New%20threat%20model');
        });

        it('can edit the model', () => {
            cy.fixture('v1-new-model').then((model) => {
                cy.get('#json-input').type(JSON.stringify(model), {parseSpecialCharSequences: false});
            });
            cy.get('#td-import-btn').click();
            cy.get('#td-edit-btn').click();
            cy.url().should('contain', '/edit');
            cy.get('#description').should('be.visible');
            cy.get('button').contains('Close').click();
        });
    });

    describe('using a valid V2 model without diagram', () => {
        it('allows a user to edit the model', () => {
            cy.fixture('v2-new-model').then((model) => {
                cy.get('#json-input').type(JSON.stringify(model), {parseSpecialCharSequences: false});
            });
            cy.get('#td-import-btn').click();
            cy.url().should('contain', '/local/New%20threat%20model');
            cy.contains('New threat model');
            cy.get('#td-edit-btn').should('be.visible');
            cy.get('#td-report-btn').should('be.visible');
            cy.get('#td-close-btn').should('be.visible');
        });
    });

    describe('using a valid V1 model with a diagram', () => {
        it('upgrades diagrams from v1 to v2', () => {
            cy.fixture('v1-model').then((model) => {
                cy.get('#json-input').type(JSON.stringify(model), {parseSpecialCharSequences: false, delay: 1});
            });
            cy.get('#td-import-btn').click();
            cy.url().should('contain', '/local/Demo%20Threat%20Model');
        });

        it('can edit the model', () => {
            cy.fixture('v1-model').then((model) => {
                cy.get('#json-input').type(JSON.stringify(model), {parseSpecialCharSequences: false, delay: 1});
            });
            cy.get('#td-import-btn').click();
            cy.get('#td-edit-btn').click();
            cy.url().should('contain', '/edit');
            cy.get('#description').should('be.visible');
            cy.get('button').contains('Close').click();
        });
    
        it('can edit the diagram', () => {
            cy.fixture('v1-model').then((model) => {
                cy.get('#json-input').type(JSON.stringify(model), {parseSpecialCharSequences: false, delay: 1});
            });
            cy.get('#td-import-btn').click();
            cy.get('.td-diagram-thumb').click();
            cy.url().should('contain', '/edit/Main%20Request%20Data%20Flow');
        });

    });

    describe('using a valid V2 model with a diagram', () => {
        it('allows a user to manually enter the model JSON', () => {
            cy.fixture('v2-model').then((model) => {
                cy.get('#json-input').type(JSON.stringify(model), {parseSpecialCharSequences: false, delay: 1});
            });
            cy.get('#td-import-btn').click();
            cy.url().should('contain', '/local/Demo%20Threat%20Model');
            cy.contains('Demo Threat Model');
            cy.contains('Main Request Data Flow');
            cy.get('#td-edit-btn').should('be.visible');
            cy.get('#td-report-btn').should('be.visible');
            cy.get('#td-close-btn').should('be.visible');
        });
    });

});

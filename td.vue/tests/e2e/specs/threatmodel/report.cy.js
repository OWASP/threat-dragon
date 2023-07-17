describe('report', () => {
    beforeEach(() => {
        cy.get('#local-login-btn').click();
        cy.get('a[href="#/demo/select"]').click();
        cy.get('a[data-model-name="Version 2 Demo Model"').click();
        cy.url().should('contain', '/local/Version%202%20Demo%20Model');
        cy.get('#td-report-btn').trigger('click');
    });

    describe('report options', () => {
        it('shows/hides out of scope elements', () => {
            cy.get('.entity-title')
                .contains('Web Application Config (Store)')
                .should('be.visible');
    
            cy.get('#show_outofscope').click({ force: true });
    
            cy.get('.entity-title')
                .contains('Web Application Config (Store)')
                .should('not.be','visible');
    
            cy.get('#show_outofscope').click({ force: true });
        });
    
        it('shows/hides mitigated threats', () => {
            cy.get('[data-test-id="Database"]')
                .contains('Unauthorised access')
                .should('be.visible');
    
            cy.get('#show_mitigated').click({ force: true });
    
            cy.get('[data-test-id="Database"]')
                .contains('Unauthorised access')
                .should('not.be','visible');
    
            cy.get('#show_mitigated').click({ force: true });
        });
    
        it('shows/hides model diagrams', () => {
            cy.get('.td-readonly-diagram')
                .should('be.visible');
    
            cy.get('#show_models').click({ force: true });
    
            cy.get('.td-readonly-diagram')
                .should('not.be','visible');
    
            cy.get('#show_models').click({ force: true });
        });
    
        it('shows/hides TD branding', () => {
            cy.get('.td-brand-text')
                .should('not.be','visible');
    
            cy.get('#show_branding').click({ force: true });

            cy.get('.td-brand-text')
                .contains('OWASP Threat Dragon')
                .should('be.visible');
    
            cy.get('#show_branding').click({ force: true });
        });
    });

    describe('executive summary', () => {
        const selectors = {
            description: '.td-summary',
            descriptionTitle: '.td-description-title',
            wrapper: '.td-executive-summary'
        };

        // This could be abstracted/reused in the future
        const assertRowHasValue = (name, val) => {
            cy.get(`[data-test-id="${name}"]`)
                .should('contain', name)
                .and('contain', val.toString());
        };

        it('shows the exec summary title', () => {
            cy.get(selectors.wrapper)
                .contains('Executive Summary');
        });

        it('shows the description', () => {
            cy.get(selectors.descriptionTitle)
                .contains('High level system description');
            cy.get(selectors.description)
                .contains('A sample model of a web application');
        });

        it('displays the table data', () => {
            assertRowHasValue('Total Threats', 14);
            assertRowHasValue('Total Mitigated', 4);
            assertRowHasValue('Not Mitigated', 10);
            assertRowHasValue('Open / High Priority', 4);
            assertRowHasValue('Open / Medium Priority', 4);
            assertRowHasValue('Open / Low Priority', 2);
            assertRowHasValue('Open / Unknown Priority', 0);
        });
    });
});

// Tests to ensure the welcome page has the required components

describe('home', () => {
    describe('login', () => {
        it('has a welcome message', () => {
            // Check for the title element instead of specific text
            cy.get('[data-testid="home-title"]').should('be.visible');
        });
    
        it('describes the application', () => {
            // Check for the description element instead of specific text
            cy.get('[data-testid="home-description"]').should('be.visible');
        });
    
        it('shows the threat dragon logo', () => {
            cy.get('#home-td-logo').should('be.visible');
        });
    
        it('always displays local login option', () => {
            cy.get('#local-login-btn').should('be.visible');
        });
    });

    describe('navbar', () => {
        const verifyExternalUrl = (selector, url) => {
            cy.get(selector)
                .find('a')
                .should('have.attr', 'href', url)
                .and('have.attr', 'rel', 'noopener noreferrer');
        };
    
        it('has a link to the home page', () => {
            cy.get('.navbar-brand').should('have.attr', 'href').and('contain', '#/');
        });
        
        it('links to the threat dragon docs', () => {
            verifyExternalUrl('#nav-docs', 'https://www.threatdragon.com/docs/');
        });
    
        it('links to the OWASP Threat Modeling Cheat Sheet', () => {
            verifyExternalUrl(
                '#nav-tm-cheat-sheet',
                'https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html'
            );
        });
    
        it('links to the OWASP Threat Dragon page', () => {
            verifyExternalUrl('#nav-owasp-td', 'https://owasp.org/www-project-threat-dragon/');
        });
    });
});

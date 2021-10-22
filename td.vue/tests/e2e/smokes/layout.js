describe('layout', () => {
    const verifyExternalUrl = (selector, url) => {
        cy.get(selector)
            .find('a')
            .should('have.attr', 'href', url)
            .and('have.attr', 'rel', 'noopener noreferrer');
    };

    before(() => {
        cy.visit('/');
    });

    it('has a link to the home page', () => {
        cy.get('.navbar-brand').should('have.attr', 'href', '#/');
    });
    
    it('links to the threat dragon docs', () => {
        verifyExternalUrl('#nav-docs', 'https://www.threatdragon.com/docs');
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

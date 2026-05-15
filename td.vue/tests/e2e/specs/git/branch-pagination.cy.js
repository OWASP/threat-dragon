const cfg = require('../../mock-server/dataset-github');

const totalPages = Math.ceil(cfg.branches.total / cfg.branches.perPage);
const lastPageRemainder = cfg.branches.total - cfg.branches.perPage * (totalPages - 1);

// Count 'feature' prefixed names within the first perPage items
const featureCountOnPage1 = cfg.branches.names.slice(0, cfg.branches.perPage)
    .filter(n => n.startsWith('feature/')).length;

const loginViaGitHub = () => {
    cy.visit('/', { onBeforeLoad: (win) => win.sessionStorage.clear() });
    cy.get('#local-login-btn').should('be.visible');
    cy.visit('/#/git/github/repository');
};

describe('GitHub provider — branch pagination', () => {
    beforeEach(() => {
        loginViaGitHub();
    });

    it('page 1 shows first page of branches with Next enabled and Previous disabled', () => {
        cy.contains('owasp/threat-dragon').click();
        cy.get('.list-group-item').should('have.length', cfg.branches.perPage);
        cy.contains('button', 'Next').should('not.be.disabled');
        cy.contains('button', 'Previous').should('be.disabled');
    });

    it('page 2 shows a full page with Next and Previous enabled', () => {
        cy.contains('owasp/threat-dragon').click();
        cy.contains('button', 'Next').click();
        cy.get('.list-group-item').should('have.length', cfg.branches.perPage);
        cy.contains('button', 'Next').should('not.be.disabled');
        cy.contains('button', 'Previous').should('not.be.disabled');
    });

    it('last page has fewer items with Next disabled and Previous enabled', () => {
        cy.contains('owasp/threat-dragon').click();
        for (let i = 1; i < totalPages; i++) {
            cy.contains('button', 'Next').click();
        }
        cy.get('.list-group-item').should('have.length', lastPageRemainder);
        cy.contains('button', 'Next').should('be.disabled');
        cy.contains('button', 'Previous').should('not.be.disabled');
    });

    it('navigates forward and back maintaining item count', () => {
        cy.contains('owasp/threat-dragon').click();
        cy.contains('button', 'Next').click();
        cy.get('.list-group-item').should('have.length', cfg.branches.perPage);
        cy.contains('button', 'Previous').click();
        cy.get('.list-group-item').should('have.length', cfg.branches.perPage);
    });

    it('filters branches by name on page 1', () => {
        cy.contains('owasp/threat-dragon').click();
        cy.get('#filter').type('feature');
        cy.get('.list-group-item').should('have.length', featureCountOnPage1);
        cy.get('.list-group-item').each($el => {
            cy.wrap($el).should('contain', 'feature');
        });
    });
});

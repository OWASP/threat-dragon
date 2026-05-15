const cfg = require('../../mock-server/dataset-github');

const loginViaGitHub = () => {
    cy.visit('/', { onBeforeLoad: (win) => win.sessionStorage.clear() });
    cy.get('#local-login-btn').should('be.visible');
    cy.visit('/#/git/github/repository');
};

describe('GitHub provider — repository pagination', () => {
    beforeEach(() => {
        loginViaGitHub();
    });

    it('page 1 shows first page of repos with Next enabled and Previous disabled', () => {
        cy.get('.list-group-item').should('have.length', cfg.repos.perPage);
        cy.contains('button', 'Next').should('not.be.disabled');
        cy.contains('button', 'Previous').should('be.disabled');
    });

    it('page 2 shows a full page with Next and Previous enabled', () => {
        cy.contains('button', 'Next').click();
        cy.get('.list-group-item').should('have.length', cfg.repos.perPage);
        cy.contains('button', 'Next').should('not.be.disabled');
        cy.contains('button', 'Previous').should('not.be.disabled');
    });

    it('last page has fewer items with Next disabled and Previous enabled', () => {
        cy.contains('button', 'Next').click();
        cy.contains('button', 'Next').click();
        const remainder = cfg.repos.total - cfg.repos.perPage * 2;
        cy.get('.list-group-item').should('have.length', remainder);
        cy.contains('button', 'Next').should('be.disabled');
        cy.contains('button', 'Previous').should('not.be.disabled');
    });

    it('navigates forward and back maintaining item count', () => {
        cy.contains('button', 'Next').click();
        cy.get('.list-group-item').should('have.length', cfg.repos.perPage);
        cy.contains('button', 'Previous').click();
        cy.get('.list-group-item').should('have.length', cfg.repos.perPage);
    });

    it('filtering by my-company shows fewer items and disables both pagination buttons on page 1', () => {
        cy.get('#filter').type('my-company');
        const orgCount = cfg.repos.orgs.filter(o => o === 'my-company').length;
        const totalForOrg = Math.floor(cfg.repos.total / cfg.repos.orgs.length) * orgCount;
        cy.get('.list-group-item').should('have.length', Math.min(totalForOrg, cfg.repos.perPage));
        cy.contains('button', 'Next').should('be.disabled');
        cy.contains('button', 'Previous').should('be.disabled');
    });

    it('filter by owasp keeps pagination active and all items contain the org name', () => {
        cy.get('#filter').type('owasp');
        cy.get('.list-group-item').should('have.length', cfg.repos.perPage);
        cy.contains('button', 'Next').should('not.be.disabled');
        cy.get('.list-group-item').each($el => {
            cy.wrap($el).should('contain', 'owasp');
        });
    });

    it('filter + pagination shows owasp items on page 2', () => {
        cy.get('#filter').type('owasp');
        cy.contains('button', 'Next').click();
        const orgCount = cfg.repos.orgs.filter(o => o === 'owasp').length;
        const totalForOrg = Math.floor(cfg.repos.total / cfg.repos.orgs.length) * orgCount;
        const remainder = totalForOrg - cfg.repos.perPage;
        cy.get('.list-group-item').should('have.length', remainder);
        cy.contains('button', 'Previous').should('not.be.disabled');
        cy.contains('button', 'Next').should('be.disabled');
        cy.get('.list-group-item').each($el => {
            cy.wrap($el).should('contain', 'owasp');
        });
    });
});

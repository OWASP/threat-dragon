const cfg = require('../../mock-server/dataset-gitlab');

const encodedRepo = encodeURIComponent(cfg.repos.fullName);
const branchPath = `/#/git/gitlab/${encodedRepo}/branch`;
const threatModelsPath = `/#/git/gitlab/${encodedRepo}/main/threatmodels`;

describe('GitLab provider - subgroup repositories', () => {
    it('shows branches for a subgroup repository path', () => {
        cy.visit(branchPath);
        cy.contains('.list-group-item', 'main').should('be.visible');
        cy.contains('.list-group-item', 'feature/subgroup-routing').should('be.visible');
    });

    it('creates a branch from a subgroup repository path', () => {
        const branchName = 'subgroup-create-branch';

        cy.visit(branchPath);
        cy.get('#new-branch').click();
        cy.get('#branchName').type(branchName);
        cy.get('#refBranch').select('main');
        cy.contains('button', 'add branch').click();

        cy.contains('.list-group-item', branchName, { timeout: 5000 }).should('be.visible');
    });

    it('opens an existing threat model from a subgroup repository path', () => {
        cy.visit(threatModelsPath);
        cy.contains('.list-group-item', 'Gateway Threat Model').click();

        cy.location('hash').should('include', 'Gateway%20Threat%20Model');
    });
});

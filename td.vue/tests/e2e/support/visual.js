Cypress.Commands.add('matchVisualSnapshot', (name) => {
    cy.wait(250);
    cy.screenshot(name, {
        capture: 'viewport',
        overwrite: true
    });
    cy.task('visual:compareSnapshot', {
        name,
        updateSnapshots: Boolean(Cypress.env('updateSnapshots'))
    }).then((result) => {
        cy.log(`Visual diff ratio for ${name}: ${result.diffPixelRatio}`);
        expect(
            result.diffPixelRatio,
            `${name} diff pixel ratio`
        ).to.be.at.most(result.maxDiffPixelRatio);
    });
});

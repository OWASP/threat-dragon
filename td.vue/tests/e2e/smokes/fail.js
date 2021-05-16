describe('fails', () => {
    it('should fail', () => {
        cy.get('#does_not_exist');
    });
});

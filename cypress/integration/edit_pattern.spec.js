describe('With a pattern editor', function () {
  beforeEach(function () {
    cy.visit('/')
  })

  // Returns the title of the current test case.
  // Use this to name `percySnapshot`s.
  function testTitle () {
    return cy.state('runnable').fullTitle()
  }

  it('A designer clicks on a row to edit it', function () {
    cy.get('.rendered-row .glass-layer')
      .first()
      .click()
    cy.percySnapshot(`${testTitle()} [at click]`)
    // TODO: too specific to the current implementation.
    cy.get('g.edited-row use')
      .should('have.length', 1)
  })
})

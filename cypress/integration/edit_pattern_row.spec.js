describe('With a pattern row editor', function () {
  // pointerId: for PointerEvent simulation.
  // https://github.com/cypress-io/cypress/issues/5660
  const pointerId = 1
  const cellWidth = 50

  beforeEach(function () {
    cy.visit('/')
  })

  // Returns a function that triggers a 'pointermove' event
  // with a new `clientX` relatively shifted by `dX` from
  // that of a target element.
  //
  // Supply a returned function to `cy.then`.
  function triggerPointermoveBy(dX) {
    return function (element) {
      expect(element).to.have.length(1)
      const { left, width } = element[0].getBoundingClientRect()
      const clientX = left + Math.floor(width * 0.5) + dX
      return cy.wrap(element)
        .trigger('pointermove', { clientX })
    }
  }

  it('A designer appends a column to a row by dragging the row expansion handle rightward', function () {
    cy.get('.row-expansion-handle')
      .as('handle')
      .trigger('pointerdown', { pointerId })
    cy.get('.row-expansion-handle-shape')
      .as('handle-shape')
      .should('have.class', 'is-dragged')
    cy.get('@handle')
      .then(triggerPointermoveBy(cellWidth))
    cy.get('@handle')
      .trigger('pointerup', { pointerId })
    cy.get('@handle-shape')
      .should('not.have.class', 'is-dragged')
    cy.get('g.edited-row use')
      .should('have.length', 4)
  })

  it('A designer removes a column from a row by dragging the row expansion handle leftward', function () {
    cy.get('.row-expansion-handle')
      .as('handle')
      .trigger('pointerdown', { pointerId })
    cy.get('.row-expansion-handle-shape')
      .as('handle-shape')
      .should('have.class', 'is-dragged')
    cy.get('@handle')
      .then(triggerPointermoveBy(-cellWidth))
    cy.get('@handle')
      .trigger('pointerup', { pointerId })
    cy.get('@handle-shape')
      .should('not.have.class', 'is-dragged')
    cy.get('g.edited-row use')
      .should('have.length', 2)
  })
})

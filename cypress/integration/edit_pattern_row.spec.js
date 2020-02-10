describe('With a pattern row editor', function () {
  const cellWidth = 50

  beforeEach(function () {
    cy.visit('/')
    // deletes the database and reloads the page
    cy.window()
      .then(window => {
        expect(window.indexedDB).to.exist
        window.indexedDB.deleteDatabase('AmidzDatabase')
      })
    cy.reload()
  })

  it('A designer appends a column to a row by dragging the row expansion handle rightward', function () {
    cy.get('.row-expansion-handle')
      .as('handle')
      .pointer('down')
    cy.percySnapshot(`${testTitle()} [at pointerdown]`)
    cy.get('.row-expansion-handle-shape')
      .as('handle-shape')
      .should('have.class', 'is-dragged')
    cy.get('@handle')
      .pointermoveBy({ dX: cellWidth })
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@handle')
      .pointer('up')
    cy.get('@handle-shape')
      .should('not.have.class', 'is-dragged')
    // TODO: too specific to the implementation details.
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 4)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })

  it('A designer removes a column from a row by dragging the row expansion handle leftward', function () {
    cy.get('.row-expansion-handle')
      .as('handle')
      .pointer('down')
    cy.get('.row-expansion-handle-shape')
      .as('handle-shape')
      .should('have.class', 'is-dragged')
    cy.get('@handle')
      .pointermoveBy({ dX: -cellWidth })
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@handle')
      .pointer('up')
    cy.get('@handle-shape')
      .should('not.have.class', 'is-dragged')
    // TODO: too specific to the implementation details.
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 2)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })

  it('A designer releases the row expansion handle before moving it rightward enough to append a column', function () {
    cy.get('.row-expansion-handle')
      .as('handle')
      .pointer('down')
      .pointermoveBy({ dX: Math.floor(cellWidth * 0.5) })
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@handle')
      .pointer('up')
    // TODO: too specific to the implementation details.
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 3)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })

  it('A designer releases the row expansion handle before moving it leftward enough to remove a column', function () {
    cy.get('.row-expansion-handle')
      .as('handle')
      .pointer('down')
      .pointermoveBy({ dX: -Math.floor(cellWidth * 0.5) })
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@handle')
      .pointer('up')
    // TODO: too specific to the implementation details.
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 3)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })

  it('Dragging of the row expansion handle by a designer is cancelled', function () {
    cy.get('.row-expansion-handle')
      .pointer('down')
      .pointermoveBy({ dX: cellWidth })
      .pointer('cancel')
    cy.get('.row-expansion-handle-shape')
      .should('not.have.class', 'is-dragged')
    // TODO: too specific to the implementation details.
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 3)
    cy.percySnapshot(`${testTitle()} [at pointercancel]`)
  })

  it('A designer deletes a row by dragging the row expansion handle to the drop row area', function () {
    cy.get('.drop-row-area')
      .should('have.css', 'display', 'none')
    cy.get('.row-expansion-handle')
      .as('handle')
      .pointer('down')
    cy.get('.drop-row-area')
      .should('not.have.class', 'is-active')
      .should('not.have.css', 'display', 'none')
    // TODO: too specific to the implementation details.
    cy.get('@handle')
      .pointermoveBy({ dX: -3 * cellWidth })
    cy.get('.drop-row-area')
      .should('have.class', 'is-active')
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@handle')
      .pointer('up')
    // TODO: too specific to the implementation details.
    cy.get('g.amidz-row')
      .should('have.length', 1)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })
})

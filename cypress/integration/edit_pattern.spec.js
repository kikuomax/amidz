describe('With a pattern editor', function () {
  const cellWidth = 50
  const cellHeight = 50

  beforeEach(function () {
    cy.visit('/')
      .then(window => {
        // flushes the AmidzDatabase
        // https://docs.cypress.io/api/commands/visit.html#Yields
        expect(window.indexedDB).to.exist
        window.indexedDB.deleteDatabase('AmidzDatabase')
      })
    cy.reload()
    cy.wait(100) // TODO: is this long enough?
  })

  it('A designer clicks on a row to edit it', function () {
    cy.get('.rendered-row .row-selection-layer')
      .first()
      .click()
    cy.percySnapshot(`${testTitle()} [at click]`)
    // TODO: too specific to the current implementation.
    cy.get('g.edited-row use')
      .should('have.length', 1)
  })

  it('A designer adds a row by clicking the add row button', function () {
    cy.get('.add-row-button .pointer-target')
      .as('pointer-target')
      .pointer('down')
    cy.get('g.add-row-button')
      .as('button')
      .should('have.class', 'is-pressed')
    cy.percySnapshot(`${testTitle()} [at pointerdown]`)
    cy.get('@pointer-target')
      .pointer('up')
    cy.get('@button')
      .should('not.have.class', 'is-pressed')
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 1)
    // TODO: too specific to the current implementation.
    cy.get('g.amidz-row')
      .should('have.length', 3)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })

  it('A designer presses the add row button but cancels by moving the pointer outside', function () {
    cy.get('.add-row-button .pointer-target')
      .as('pointer-target')
      .pointer('down')
      .pointermoveBy({ dX: cellWidth, dY: cellHeight })
    cy.get('g.add-row-button')
      .should('not.have.class', 'is-pressed')
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@pointer-target')
      .pointer('up')
    // TODO: too specific to the current implementation.
    cy.get('g.amidz-row')
      .should('have.length', 2)
  })

  it('Pressing of the add row button by a designer is cancelled', function () {
    cy.get('.add-row-button .pointer-target')
      .pointer('down')
      .pointer('cancel')
    cy.get('g.add-row-button')
      .should('not.have.class', 'is-pressed')
    // TODO: too specific to the implementation details.
    cy.get('g.amidz-row')
      .should('have.length', 2)
    cy.percySnapshot(`${testTitle()} [at pointercancel]`)
  })
})

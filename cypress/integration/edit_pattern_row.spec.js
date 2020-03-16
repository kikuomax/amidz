import version2 from '../../src/db/version2'

describe('With a pattern row editor', function () {
  const cellWidth = 50

  beforeEach(function () {
    // populates a test database.
    // database population must be done before the site is visited.
    cy.window()
      .openAmidzDatabase()
      .then(db => {
        return new Cypress.Promise((resolve, reject) => {
          const transaction = db.transaction('pattern', 'readwrite')
          transaction.oncomplete = () => {
            // just to monitor the progress
            expect(true, 'database prepared').to.be.true
            resolve()
          }
          transaction.onerror = () => {
            reject(new Error('failed to prepare database'))
          }
          const patternStore = transaction.objectStore('pattern')
          patternStore.put({
            name: '$current',
            rows: [
              {
                position: {
                  left: 0,
                  top: 50
                },
                columns: [
                  {
                    symbolId: 'test-symbol'
                  },
                  {
                    symbolId: 'test-symbol'
                  },
                  {
                    symbolId: 'test-symbol2'
                  }
                ]
              },
              {
                position: {
                  left: 0,
                  top: 0
                },
                columns: [
                  {
                    symbolId: 'test-symbol'
                  }
                ]
              }
            ]
          })
        })
      })
    cy.visit('/')
    // waits until the editor container gets ready.
    cy.get('.editor-container')
      .should('have.class', 'is-ready')
    // waits until the loading spinner disappears.
    // depends on the implementation of Buefy.
    // https://github.com/buefy/buefy/blob/8bb52c28d647798d48a52467dc5747fdb4d0025e/src/components/loading/Loading.vue#L4
    cy.get('.editor-container .loading-overlay')
      .should('not.exist')
  })

  afterEach(function () {
    // flushes the AmidzDatabase
    cy.window()
      .deleteAmidzDatabase()
  })

  it('A designer appends a column to a row by dragging the row expansion handle rightward', function () {
    cy.get('.row-expansion-handle .pointer-target')
      .as('pointer-target')
      .pointer('down')
    cy.get('.row-expansion-handle')
      .as('handle')
      .should('have.class', 'is-dragged')
    cy.percySnapshot(`${testTitle()} [at pointerdown]`)
    cy.get('@pointer-target')
      .pointermoveBy({ dX: cellWidth })
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@pointer-target')
      .pointer('up')
    cy.get('@handle')
      .should('not.have.class', 'is-dragged')
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 4)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })

  it('A designer removes a column from a row by dragging the row expansion handle leftward', function () {
    cy.get('.row-expansion-handle .pointer-target')
      .as('pointer-target')
      .pointer('down')
    cy.get('.row-expansion-handle')
      .as('handle')
      .should('have.class', 'is-dragged')
    cy.get('@pointer-target')
      .pointermoveBy({ dX: -cellWidth })
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@pointer-target')
      .pointer('up')
    cy.get('@handle')
      .should('not.have.class', 'is-dragged')
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 2)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })

  it('A designer releases the row expansion handle before moving it rightward enough to append a column', function () {
    cy.get('.row-expansion-handle .pointer-target')
      .as('pointer-target')
      .pointer('down')
      .pointermoveBy({ dX: Math.floor(cellWidth * 0.5) })
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@pointer-target')
      .pointer('up')
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 3)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })

  it('A designer releases the row expansion handle before moving it leftward enough to remove a column', function () {
    cy.get('.row-expansion-handle .pointer-target')
      .as('pointer-target')
      .pointer('down')
      .pointermoveBy({ dX: -Math.floor(cellWidth * 0.5) })
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@pointer-target')
      .pointer('up')
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 3)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })

  it('Dragging of the row expansion handle by a designer is cancelled', function () {
    cy.get('.row-expansion-handle .pointer-target')
      .pointer('down')
      .pointermoveBy({ dX: cellWidth })
      .pointer('cancel')
    cy.get('.row-expansion-handle')
      .should('not.have.class', 'is-dragged')
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 3)
    cy.percySnapshot(`${testTitle()} [at pointercancel]`)
  })

  it('A designer deletes a row by dragging the row expansion handle to the drop row area', function () {
    cy.get('.drop-row-area')
      .should('have.css', 'display', 'none')
    cy.get('.row-expansion-handle .pointer-target')
      .as('pointer-target')
      .pointer('down')
    cy.get('.drop-row-area')
      .should('not.have.class', 'is-active')
      .should('not.have.css', 'display', 'none')
    cy.get('@pointer-target')
      .pointermoveBy({ dX: -3 * cellWidth })
    cy.get('.drop-row-area')
      .should('have.class', 'is-active')
    cy.percySnapshot(`${testTitle()} [at pointermove]`)
    cy.get('@pointer-target')
      .pointer('up')
    cy.get('g.amidz-row')
      .should('have.length', 1)
    cy.percySnapshot(`${testTitle()} [at pointerup]`)
  })
})

import version2 from '../../src/db/version2'

describe('With a pattern row editor', function () {
  const cellWidth = 50

  beforeEach(function () {
    // populates a test database.
    // database population must be done before the site is visited.
    cy.window()
      .then(window => {
        expect(window).to.exist
        return new Cypress.Promise((resolve, reject) => {
          const request = window.indexedDB.open('AmidzDatabase')
          request.onsuccess = event => {
            // just to monitor the progress
            expect(true, 'database opened').to.be.true
            const db = event.target.result
            db.onversionchange = () => {
              db.close()
            }
            const transaction = db.transaction('pattern', 'readwrite')
            transaction.oncomplete = () => {
              // just to monitor the progress
              expect(true, 'database prepared').to.be.true
              resolve()
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
                      symbolid: 'test-symbol'
                    }
                  ]
                }
              ]
            })
          }
          request.onupgradeneeded = event => {
            const db = event.target.result
            version2.populateStores(db)
          }
          request.onerror = () => {
            reject(new Error('failed to open AmidzDatabase'))
          }
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
      .then(window => {
        expect(window.indexedDB).to.exist
        return new Cypress.Promise((resolve, reject) => {
          const request = window.indexedDB.deleteDatabase('AmidzDatabase')
          request.onsuccess = function () {
            expect(true, 'database deleted').to.be.true
            resolve()
          }
          request.onerror = function () {
            reject(new Error('failed to flush AmidzDatabase'))
          }
        })
      })
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

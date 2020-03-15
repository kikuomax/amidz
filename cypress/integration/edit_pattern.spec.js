import version2 from '../../src/db/version2'

describe('With a pattern editor', function () {
  const cellWidth = 50
  const cellHeight = 50

  beforeEach(function () {
    // populates a test database.
    // database population must be done before the page is opened.
    cy.window()
      .then(window => {
        expect(window).to.exist
        return new Cypress.Promise((resolve, reject) => {
          const request = window.indexedDB.open('AmidzDatabase', 2)
          request.onsuccess = event => {
            // just to monitor the progress
            expect(true, 'database opened').to.be.true
            const db = event.target.result
            db.onversionchange = () => {
              // do not forget to close the IndexedDB
              // to prevent blocking when it is deleted.
              db.close()
            }
            // puts a test pattern
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
                      symbolId: 'test-symbol'
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
    // flushes AmidzDatabase
    cy.window()
      .then(window => {
        expect(window).to.exist
        return new Cypress.Promise((resolve, reject) => {
          const request = window.indexedDB.deleteDatabase('AmidzDatabase')
          request.onsuccess = () => {
            // just to monitor the progress
            expect(true, 'database deleted').to.be.true
            resolve()
          }
          request.onerror = () => {
            reject(new Error('failed to flush AmidzDatabase'))
          }
        })
      })
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

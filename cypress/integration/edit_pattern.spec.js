import version2 from '../../src/db/version2'

describe('With a pattern editor', function () {
  const cellWidth = 50
  const cellHeight = 50

  beforeEach(function () {
    // populates a test database.
    // database population must be done before the page is opened.
    cy.window()
      .openAmidzDatabase()
      .then(db => {
        return new Cypress.Promise((resolve, reject) => {
          // puts a test pattern
          const transaction = db.transaction('pattern', 'readwrite')
          transaction.oncomplete = () => {
            // just to monitor the progress
            expect(true, 'database prepared').to.be.true
            resolve()
          }
          transaction.onerror = () => {
            reject(new Error('failed to prepare a database'))
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
    // flushes AmidzDatabase
    cy.window()
      .deleteAmidzDatabase()
  })

  it('The editor selects the row at the index 0 at first', function () {
    cy.get('g[data-row-index=0]')
      .should('have.class', 'edited-row')
  })

  it('A designer clicks on a row to edit it', function () {
    cy.get('g[data-row-index=1]')
      .as('row-to-edit')
      .should('not.have.class', 'edited-row')
    cy.get('g[data-row-index=1] .row-selection-layer')
      .click()
    cy.percySnapshot(`${testTitle()} [at click]`)
    cy.get('@row-to-edit')
      .should('have.class', 'edited-row')
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
    cy.get('g[data-row-index=2]')
      .should('have.class', 'edited-row')
    cy.get('g.edited-row .amidz-symbol')
      .should('have.length', 1)
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
    cy.get('g.amidz-row')
      .should('have.length', 2)
  })

  it('Pressing of the add row button by a designer is cancelled', function () {
    cy.get('.add-row-button .pointer-target')
      .pointer('down')
      .pointer('cancel')
    cy.get('g.add-row-button')
      .should('not.have.class', 'is-pressed')
    cy.get('g.amidz-row')
      .should('have.length', 2)
    cy.percySnapshot(`${testTitle()} [at pointercancel]`)
  })
})

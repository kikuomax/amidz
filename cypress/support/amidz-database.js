import { populateStores } from '../../src/db'

// Adds a new command `openAmidzDatabase` that opens `AmidzDatabase`.
//
// This command has to follow a window.
// `cy.window().openAmidzDatabase()`
//
// This command returns an `IndexedDB`.
//
// This command opens and populates the latest version of a database by default.
//
// To open a version 1 database.
// `cy.window().openAmidzDatabase({ version: 1 })`
Cypress.Commands.add(
  'openAmidzDatabase',
  {
    prevSubject: 'window'
  },
  (window, _options) => {
    const options = {
      version: 2,
      ..._options
    }
    return new Cypress.Promise((resolve, reject) => {
      const { version } = options
      const request = window.indexedDB.open('AmidzDatabase', version)
      request.onsuccess = event => {
        // just to monitor the progress
        expect(true, 'database opened').to.be.true
        const db = event.target.result
        db.onversionchange = () => {
          // do not forget to close the IndexedDB
          // to prevent blocking when it is deleted.
          db.close()
        }
        resolve(db)
      }
      request.onupgradeneeded = event => {
        const db = event.target.result
        populateStores(db, version)
      }
      request.onerror = () => {
        reject(new Error('failed to open AmidzDatabase'))
      }
    })
  }
)

// Adds a new command `deleteAmidzDatabase` that closes `AmidzDatabase`.
//
// This command has to follow a window.
// `cy.window().deleteAmidzDatabase()`
//
// This command will block if there is an opened database and it does not close
// on a `versionchange` event.
Cypress.Commands.add(
  'deleteAmidzDatabase',
  {
    prevSubject: 'window'
  },
  window => {
    return new Cypress.Promise((resolve, reject) => {
      const request = window.indexedDB.deleteDatabase('AmidzDatabase')
      request.onsuccess = () => {
        // just to monitor the progress
        expect(true, 'database deleted').to.be.true
        resolve()
      }
      request.onerror = () => {
        reject(new Error('failed to delete AmidzDatabase'))
      }
    })
  }
)

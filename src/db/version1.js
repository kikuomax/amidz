/**
 * Initial version of the database.
 *
 * Only for test.
 *
 * @namespace version1
 *
 * @memberof module:db
 */

/* global process */

/**
 * Populates stores of the database version 1.
 *
 * Populates a dummy database for tests.
 *
 * @function populateStores
 *
 * @param {IDBDatabase} db
 *
 *   `IDBDatabase` where stores are to be populated.
 *
 * @throws {TypeError}
 *
 *   If `db` is not compatible with `IDBDatabase`.
 *
 * @memberof module:db.version1
 */
function populateStores (db) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`version1.populateStores`)
  }
  const pattern = db.createObjectStore('pattern', {
    keyPath: 'name'
  })
  pattern.add({
    name: '$current',
    rows: [
      {
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
        columns: [
          {
            symbolId: 'test-symbol2'
          }
        ]
      } 
    ]
  })
}

export default {
  populateStores
}

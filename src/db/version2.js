/**
 * Database version 2.
 *
 * @namespace version2
 *
 * @memberof module:db
 */

/* global process */

/**
 * Populates stores of the database version 2.
 *
 * Populates a `pattern` store with a single object that has the following
 * fields,
 * - `name`: {`string`} = `'$current'`
 * - `rows`: {`array`} that is empty
 *
 * @function populateStores
 *
 * @param {IDBDatabase} db
 *
 *   Database where stores are to be populated.
 *
 * @throws {TypeError}
 *
 *   If `db` is not compatible with `IDBDatabase`.
 *
 * @memberof module:db.version2
 */
function populateStores (db) {
  const pattern = db.createObjectStore('pattern', {
    keyPath: 'name'
  })
  pattern.add({
    name: '$current',
    rows: []
  })
}

/**
 * Upgrades stores from a given version to the version 2.
 *
 * #### From version 1
 *
 * Upgrade from the version 1 is done by the function
 * [upgradeStoresFromVersion1]{@linkcode module:db.version2.upgradeStoresFromVersion1}.
 *
 * @function upgradeStoresFrom
 *
 * @param {IDBTransaction} transaction
 *
 *   `IDBTransaction` where stores are to be upgraded.
 *
 * @param {number} oldVersion
 *
 *   Version of the database to be upgraded.
 *
 * @throws {TypeError}
 *
 *   If `transaction` is not compatible with `IDBTransaction`.
 *
 * @throws {RangeError}
 *
 *   If `oldVersion` is not `1`.
 *
 * @memberof module:db.version2
 */
function upgradeStoresFrom (transaction, oldVersion) {
  if (oldVersion === 1) {
    return upgradeStoresFromVersion1(transaction)
  } else {
    throw new RangeError(`database can be upgraded only from version 1 but ${oldVersion} was specified`)
  }
}

/**
 * Upgrades a database from the version 1 to the version 2.
 *
 * Every object in the `pattern` store is updated with the function
 * [upgradePatternFromVersion1]{@linkcode module:db.version2.upgradePatternFromVersion1}.
 *
 * @function upgradeStoresFromVersion1
 *
 * @param {IDBTransaction} transaction
 *
 *   `IDBTransaction` where store are to be upgraded.
 *
 * @throws {TypeError}
 *
 *   If `transaction` is not compatible with `IDBTransaction`.
 *
 * @memberof module:db.version2
 */
function upgradeStoresFromVersion1 (transaction) {
  const pattern = transaction.objectStore('pattern')
  const request = pattern.openCursor()
  request.onsuccess = event => {
    const cursor = event.target.result
    if (cursor) {
      const { value } = cursor
      const upgraded = upgradePatternFromVersion1(value)
      pattern.put(upgraded)
      cursor.continue()
    }
  }
}

/**
 * Upgrades a given pattern object of the version 1 to the version2.
 *
 * The upgraded pattern will be an object that has the following fields,
 *
 * - `name`: {`string`} `pattern.name`
 * - `rows`: {`array`} where there are `pattern.rows.length` elements and
 *   the `i`th element is an object that has the following fields,
 *     - `position`: {`object`} that has the following fields,
 *         - `left`: {`number`} `0`
 *         - `top`: {`number`} `50 * (pattern.rows.length - i - 1)`
 *     - `columns`: {`array`}
 *       that is equivalent to `pattern.rows[i].columns`.
 *
 * If `pattern` does not have an array `rows`, the `rows` field of
 * the upgraded pattern will be an empty array.
 *
 * If `pattern.rows[i]` does not have an array `columns`, the `rows` field of
 * the upgraded pattern will be an empty array.
 *
 * @function upgradePatternFromVersion1
 *
 * @param {object} pattern
 *
 *   Pattern object to be upgraded.
 *
 * @return {object}
 *
 *   Upgraded pattern object.
 *
 * @throws {TypeError}
 * If one of the following conditions is met,
 * - `pattern` is `null`.
 * - `pattern` is not an `object`.
 *
 * @throws {RangeError}
 *
 *   If `pattern` does not have a field `name`.
 *
 * @memberof module:db.version2
 */
export function upgradePatternFromVersion1 (pattern) {
  if (typeof(pattern) !== 'object') {
    throw new TypeError(
      `pattern must be an object but ${typeof(pattern)} was given`)
  }
  const { name, rows } = pattern
  if (name === undefined) {
    throw new RangeError('pattern must have name')
  }
  // throws an Error if there is a row without `columns`.
  try {
    return {
      name,
      rows: (rows || []).map((row, i) => {
        if (!('columns' in row)) {
          throw new Error('row must have columns')
        }
        return {
          position: {
            left: 0,
            top: 50 * (rows.length - i - 1),
          },
          ...row
        }
      })
    }
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(err)
    }
    return {
      name,
      rows: []
    }
  }
}

export default {
  populateStores,
  upgradeStoresFrom,
  upgradePatternFromVersion1
}

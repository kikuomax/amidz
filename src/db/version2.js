/**
 * Database version 2.
 *
 * @namespace version2
 *
 * @memberof module:db
 */

/* global process */

/**
 * Populates stores.
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
 * @return {Promise}
 *
 *   `Promise` that is resolved into nothing when the population ends.
 *   May be rejected with
 *   - `TypeError`:
 *     if `db` is not compatible with `IDBDatabase`.
 *
 * @memberof module:db.version2
 */
function populateStores (db) {
  return new Promise((resolve, reject) => {
    try {
      const pattern = db.createObjectStore('pattern', {
        keyPath: 'name'
      })
      pattern.add({
        name: '$current',
        rows: []
      })
      resolve()
    } catch (err) {
      reject(err)
    }
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
 * @param {IDBDatabase} db
 *
 *   Database to be upgraded.
 *
 * @param {number} oldVersion
 *
 *   Version of the database to be upgraded.
 *
 * @return {Promise}
 *
 *   `Promise` that is resolved into nothing when the upgrade ends.
 *   May be rejected with
 *   - `TypeError`:
 *     if `db` is not compatible with `IDBDatabase`.
 *   - `RangeError`:
 *     if `oldVersion` is not `1`.
 *
 * @memberof module:db.version2
 */
function upgradeStoresFrom (db, oldVersion) {
  if (oldVersion === 1) {
    return upgradeStoresFromVersion1(db)
  } else {
    return Promise.fail(new RangeError(`database may be upgraded only from version 1 but ${oldVersion} was specified`))
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
 * @param {IDBDatabase} db
 *
 *   Database to be upgraded.
 *
 * @return {Promise}
 *
 *   `Promise` that is resolved into nothing when the upgrade ends.
 *   May be rejected with
 *   - `TypeError` if `db` is not compatible with `IDBDatabase`.
 *   - `Error` if a transaction could not be completed.
 *
 * @memberof module:db.version2
 */
function upgradeStoresFromVersion1 (db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('pattern', 'readwrite')
    transaction.oncomplete = () => {
      resolve()
    }
    transaction.onerror = () => {
      reject(new Error('failed to obtain the pattern store from the database'))
    }
    const pattern = transaction.objectStore('pattern')
    const request = pattern.openCursor()
    request.onsuccess = event => {
      const cursor = event.target.result
      if (cursor) {
        const { value } = cursor
        transaction.put(upgradePatternFromVersion1(value))
        cursor.continue()
      }
    }
  })
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
function upgradePatternFromVersion1 (pattern) {
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
          left: 0,
          top: 50 * (rows.length - i - 1),
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

export {
  populateStores,
  upgradeStoresFrom,
  upgradePatternFromVersion1
}

// to suppress Webpack warning.
export default {}

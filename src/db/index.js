/**
 * Database for Amidz.
 *
 * There is no database version 1 because it was an experimental version.
 *
 * @module db
 */

import version1 from './version1'
import version2 from './version2'

/* global process */

/**
 * Populates stores of a given version of database.
 *
 * @function populateStores
 *
 * @param {IDBDatabase} db
 *
 *   [IDBDatabase]{@linkcode https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase} where stores are to be populated.
 *
 * @param {number} version
 *
 *   Version of the database to be populated.
 *
 * @throws {TypeError}
 *
 *   If `db` is not compatible with `IDBDatabase`.
 *
 * @throws {RangeError}
 *
 *   If `version` is not supported.
 */
export function populateStores (db, version) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('populateStores', version)
  }
  switch (version) {
    case 1:
      version1.populateStores(db)
      break
    case 2:
      version2.populateStores(db)
      break
    default:
      throw new RangeError(`unsupported version: ${version}`)
  }
}

/**
 * Upgrades stores from one version to another.
 *
 * **NOTE**: Stores are reset if they are not in a good shape.
 *
 * @function upgradeStores
 *
 * @param {IDBTransaction} transaction
 *
 *   [IDBTransaction]{@linkcode https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction} where stores are to be populated.
 *
 * @param {object} _
 *
 *   Object that has the following fields,
 *   - `oldVersion`: {`number`}
 *     Old version of the database to upgrade from.
 *   - `newVersion`: {`number`}
 *     New version of the database to upgrade to.
 *
 * @throws {TypeError}
 *
 *   If `transaction` is not compatible with `IDBTransaction`.
 *
 * @throws {RangeError}
 *
 * If one or more of the following conditions are met,
 * - `oldVersion` is not supported.
 * - `newVersion` is not supported.
 * - Upgrade from `oldVersion` to `newVersion` is not supported.
 */
export function upgradeStores (transaction, { oldVersion, newVersion }) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('upgradeStores', oldVersion, newVersion)
  }
  switch (newVersion) {
    case 2:
      version2.upgradeStoresFrom(transaction, oldVersion)
      break
    default:
      throw new RangeError(`unsupported database version: ${newVersion}`)
  }
}

/**
 * Database for Amidz.
 *
 * There is no database version 1 because it was an experimental version.
 *
 * @module db
 */

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
 * @return {Promise}
 *
 *   `Promise` that resolves when the population ends.
 *   May be rejected with
 *   - `TypeError`:
 *     If `db` is not compatible with `IDBDatabase`.
 *   - `RangeError`:
 *     If `version` is not supported.
 */
export function populateStores (db, version) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('populateStores', version)
  }
  let populate
  switch (version) {
    case 2:
      populate = version2.populateStores(db)
      break
    default:
      populate = Promise.fail(new RangeError(`unsupported version: ${version}`))
  }
  return populate
}

/**
 * Upgrades stores from one version to another.
 *
 * **NOTE**: Stores are reset if they are not in a good shape.
 *
 * @function upgradeStores
 *
 * @param {IDBDatabase} db
 *
 *   [IDBDatabase]{@linkcode https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase} where stores are to be populated.
 *
 * @param {object} _
 *
 *   Object that has the following fields,
 *   - `oldVersion`: {`number`}
 *     Old version of the database to upgrade from.
 *   - `newVersion`: {`number`}
 *     New version of the database to upgrade to.
 *
 * @return {Promise}
 *
 *   `Promise` that resolves when the upgrade ends.
 *   May be rejected with
 *   - `TypeError`:
 *     If `db` is not compatible with `IDBDatabase`.
 *   - `RangeError`:
 *     One or more of the following conditions are met,
 *       - `oldVersion` is not supported.
 *       - `newVersion` is not supported.
 *       - Upgrade from `oldVersion` to `newVersion` is not supported.
 */
export function upgradeStores (db, { oldVersion, newVersion }) {
  if (process.env.NODE_ENV !== 'production') {
    console.log('exportStores', oldVersion, newVersion)
  }
  let upgrade
  if (newVersion === 2) {
    upgrade = version2.upgradeStoresFrom(db, oldVersion)
  } else {
    upgrade = Promise.reject(
      new RangeError(`unsupported database version: ${newVersion}`))
  }
  return upgrade
}

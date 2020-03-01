/**
 * `Vuex` module of a current pattern.
 *
 * @namespace pattern
 *
 * @memberof module:store
 */

/* global process */

/**
 * `State` of the current pattern.
 *
 * Following fields are defined,
 * - `patternData`: {`object`}
 *   Data of the pattern currently being edited.
 *   Has the following fields,
 *     - `rows`: {`array<object>`}
 *       Rows, bottom to top, of the pattern currently being edited.
 *       Each element is an object with the following fields,
 *         - `columns`: {`array<object>`}
 *           Columns, left to right, of the row.
 *           Each element is an object with the following fields,
 *             - `symbolId`: {`string`}
 *               ID of the symbol associated with the column.
 *
 *   A single blank cell by default.
 *
 * @member {object} state
 *
 * @memberof module:store.pattern
 */
const state = {
  patternData: {
    rows: [
      {
        columns: [
          {
            symbolId: 'blank-symbol'
          }
        ]
      }
    ]
  }
}

const getters = {}

/**
 * `Mutations` of the current pattern.
 *
 * The follwoing functions are defined,
 * - [setSymbolAt]{@linkcode module:store.pattern.setSymbolAt}
 * - [setColumnCount]{@linkcode module:store.pattern.setColumnCount}
 * - [appendNewRow]{@linkcode module:store.pattern.appendNewRow}
 * - [deleteRow]{@linkcode module:store.pattern.deleteRow}
 * - [replacePatternData]{@linkcode module:store.pattern.replacePatternData}
 *
 * @member {object} mutations
 *
 * @memberof module:store.pattern
 */
const mutations = {
  /**
   * (Mutation) Sets a symbol at a given cell.
   *
   * @function setSymbolAt
   *
   * @param {object} state
   *
   *   `State` of the `pattern` store.
   *
   * @param {object} _
   *
   *   Has the following fields,
   *   - `rowIndex`: {`number`}
   *     Row index of the cell to be updated.
   *   - `columnIndex`: {`number`}
   *     Column index of the cell to be updated.
   *   - `symbol`: {`object`}
   *     Symbol to set.
   *     Has the following field,
   *       - `symbolId`: {`string`}
   *         ID of the symbol.
   *
   * @memberof module:store.pattern
   */
  setSymbolAt (state, { rowIndex, columnIndex, symbol }) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[pattern].setSymbolAt', rowIndex, columnIndex, symbol)
    }
    const { patternData } = state
    const { rows } = patternData
    const { columns } = rows[rowIndex]
    columns[columnIndex].symbolId = symbol.symbolId
  },
  /**
   * (Mutation) Sets the number of columns of a given row.
   *
   * @function setColumnCount
   *
   * @param {object} state
   *
   *   `State` of the `pattern` store.
   *
   * @param {object} _
   *
   *   Has the following fields,
   *   - `rowIndex`: {`number`}
   *     Row index of the cell to be updated.
   *   - `columnCount`: {`number`}
   *     Number of rows to set.
   *
   * @memberof module:store.pattern
   */
  setColumnCount (state, { rowIndex, columnCount }) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[pattern].setColumnCount', rowIndex, columnCount)
    }
    const { patternData } = state
    const { rows } = patternData
    const { columns } = rows[rowIndex]
    if (columnCount < columns.length) {
      columns.splice(columnCount)
    } else {
      for (let cc = columns.length; cc < columnCount; ++cc) {
        columns.push({
          symbolId: 'blank-symbol'
        })
      }
    }
  },
  /**
   * (Mutation) Appends a new row.
   *
   * Appends a new row with a single blank column.
   *
   * @function appendNewRow
   *
   * @param {object} state
   *
   *   `State` of the `pattern` store.
   *
   * @memberof module:store.pattern
   */
  appendNewRow (state) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[pattern].appendNewRow')
    }
    const { patternData } = state
    const { rows } = patternData
    const newRow = {
      columns: [
        {
          symbolId: 'blank-symbol'
        }
      ]
    }
    rows.push(newRow)
  },
  /**
   * (Mutation) Deletes a given row.
   *
   * @function deleteRow
   *
   * @param {object} state
   *
   *   `State` of the `pattern` store.
   *
   * @param {object} _
   *
   *   Has the following field,
   *   - `rowIndex`: {`number`}
   *     Index of the row to be deleted.
   *
   * @memberof module:store.pattern
   */
  deleteRow (state, { rowIndex }) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[pattern].deleteRow')
    }
    const { patternData } = state
    const { rows } = patternData
    rows.splice(rowIndex, 1)
  },
  /**
   * (Mutation) Replaces the pattern data with a given object.
   *
   * @function replacePatternData
   *
   * @param {object} state
   *
   *   `State` of the `pattern` store.
   *
   * @param {object} _
   *
   *   Has the following field,
   *   - `patternData`: {`object`}
   *     Pattern data to replace the state.
   *
   * @memberof module:store.pattern
   */
  replacePatternData (state, { patternData }) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[pattern].replacePattern', patternData)
    }
    state.patternData = patternData
  }
}

/**
 * (Action) Saves the current pattern to the database.
 *
 * Before registering this function as an actual action of a store,
 * you have to bind the first argument `promisedDb`.
 *
 * @function saveCurrentPattern
 *
 * @param {Promise} promisedDb
 *
 *   `Promise` that will be resolved into an `IDBDatabase`.
 *
 * @param {object} _
 *
 *   Context provided by Vuex.
 *   Only `state` is used.
 *
 * @return {Promise}
 *
 *   Resolved when the save succeeds
 *   Rejected when it fails.
 *
 * @memberof module:store.pattern
 */
function saveCurrentPattern (promisedDb, { state }) {
  return promisedDb
    .then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('pattern', 'readwrite')
        transaction.oncomplete = event => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[pattern].saveCurrentPattern', 'oncomplete', event)
          }
        }
        transaction.onerror = event => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[pattern].saveCurrentPattern', 'onerror', event)
          }
          reject(new Error('failed to save the current pattern'))
        }
        const patternStore = transaction.objectStore('pattern')
        const putRequest = patternStore.put({
          name: '$current',
          ...state.patternData
        })
        putRequest.onsuccess = event => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[pattern].saveCurrentPattern', 'onsuccess', event)
          }
          resolve()
        }
      })
    })
}

/**
 * (Action) Loads the current pattern from the database.
 *
 * Before registering this function as an actual action of a store,
 * you have to bind the first argument `promisedDb`.
 *
 * @function loadCurrentPattern
 *
 * @param {Promise} promisedDb
 *
 *   `Promise` that will be resolved into an `IDBDatabase`.
 *
 * @param {object} _
 *
 *   Object supplied by Vuex.
 *   Only `commit` is used.
 *
 * @return {Promise}
 *
 *   Resolved when the loading ends.
 *   Rejected when it fails.
 *
 * @memberof module:store.pattern
 */
function loadCurrentPattern (promisedDb, { commit }) {
  return promisedDb
    .then(db => {
      return new Promise((resolve, reject) => {
        const transaction = db.transaction('pattern', 'readonly')
        transaction.oncomplete = event => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[pattern].loadCurrentPattern', 'oncomplete', event)
          }
        }
        transaction.onerror = event => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[pattern].loadCurrentPattern', 'onerror', event)
          }
          reject(new Error('failed to load current pattern'))
        }
        const patternStore = transaction.objectStore('pattern')
        const getRequest = patternStore.get('$current')
        getRequest.onsuccess = event => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[pattern].loadCurrentPattern', 'onsuccess', event)
          }
          const { result: patternData } = event.target
          if (process.env.NODE_ENV !== 'production') {
            console.log('[pattern].loadCurrentPattern', 'patternData', patternData)
          }
          resolve(patternData)
        }
      })
    })
    .then(patternData => commit('replacePatternData', { patternData }))
}

/**
 * Creates a new Vuex store module that manages the current pattern.
 *
 * @function createStore
 *
 * @param {Promise} promisedDb
 *
 *   `Promise` that will be resolved into an object like `IDBDatabase`.
 *
 * @return {object}
 *
 *   Vuex store module for the current pattern.
 *
 * @memberof module:store.pattern
 */
export function createStore (promisedDb) {
  /**
   * `Actions` of the current pattern.
   *
   * This object is initialized in
   * [createStore]{@linkcode module:store.pattern.createStore}
   *
   * The following functions are defined,
   * - [saveCurrentPattern]{@linkcode module:store.pattern.saveCurrentPattern}
   *   with `promisedDb` bound.
   * - [loadCurrentPattern]{@linkcode module:store.pattern.loadCurrentPattern}
   *   with `promisedDb` bound.
   *
   * @member actions
   *
   * @memberof module:store.pattern
   */
  const actions = {
    saveCurrentPattern: saveCurrentPattern.bind(null, promisedDb),
    loadCurrentPattern: loadCurrentPattern.bind(null, promisedDb)
  }
  return {
    state,
    getters,
    mutations,
    actions
  }
}

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
          reject('failed to load current pattern')
        }
        const patternStore = transaction.objectStore('pattern')
        const getRequest = patternStore.get('$current')
        getRequest.onsuccess = event => {
          if (process.env.NODE_ENV !== 'production') {
            console.log('[pattern].loadCurrentPattern', 'onsuccess', event)
          }
          const { result: patternData } = event.target
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
  const actions = {
    loadCurrentPattern: loadCurrentPattern.bind(null, promisedDb)
  }
  return {
    state,
    getters,
    mutations,
    actions
  }
}

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
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}

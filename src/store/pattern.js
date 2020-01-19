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
 * The follwoing field is defined,
 * - `setSymbolAt`: {`function`}
 *   Sets the symbol of a specified cell to a given symbol.
 *   Takes an object that has the following fields,
 *     - `rowIndex`: {`number`}
 *       Row index of the cell to be replaced.
 *     - `columnIndex`: {`number`}
 *       Column index of the cell to be replaced.
 *     - `symbol`: {`object`}
 *       Symbol to set.
 *       Has the following field,
 *         - `symbolId`: {`string`}
 *           ID of the symbol to set.
 * - `setColumnCount`: {`function`}
 *   Sets the number of columns of a specified row.
 *   Takes an object that has the following fields,
 *     - `rowIndex`: {`number`}
 *       Index of the row to resize.
 *     - `columnCount`: {`number`}
 *       Number of columns to set.
 *
 *   If `columnCount` is smaller than the current number of columns,
 *   extra columns are simply deleted.
 *   If `columnCount` is larger than the current number of columns,
 *   new columns are populated with a blank symbol.
 *
 * @member {object} mutations
 *
 * @memberof module:store.pattern
 */
const mutations = {
  setSymbolAt (state, { rowIndex, columnIndex, symbol }) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[pattern].setSymbolAt', rowIndex, columnIndex, symbol)
    }
    const { patternData } = state
    const { rows } = patternData
    const { columns } = rows[rowIndex]
    columns[columnIndex].symbolId = symbol.symbolId
  },
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
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}

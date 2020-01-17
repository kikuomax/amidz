/**
 * Vuex module of a current pattern.
 *
 * @namespace pattern
 *
 * @memberof module:store
 */

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
 * @memberof module:store/pattern
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
          },
          {
            symbolId: 'blank-symbol'
          },
          {
            symbolId: 'blank-symbol'
          },
          {
            symbolId: 'blank-symbol'
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
 *
 * @member {object} mutations
 *
 * @memberof module:store/pattern
 */
const mutations = {
  setSymbolAt (state, { rowIndex, columnIndex, symbol }) {
    const { patternData } = state
    const { rows } = patternData
    const { columns } = rows[rowIndex]
    columns[columnIndex].symbolId = symbol.symbolId
  }
}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}

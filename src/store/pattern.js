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

const mutations = {}

const actions = {}

export default {
  state,
  getters,
  mutations,
  actions
}

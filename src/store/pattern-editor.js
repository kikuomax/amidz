/**
 * `Vuex` model of the pattern editor.
 *
 * @namespace pattern-editor
 *
 * @memberof module:store
 */

/**
 * `State` of the pattern editor.
 *
 * The following field is defined,
 * - `symbolToPlace`: {`object`}
 *   Symbol to place.
 *   Has the following field,
 *     - `symbolId`: {`string`}
 *       ID of the symbol to place.
 *
 * @member {object} state
 *
 * @memberof module:store.pattern-editor
 */
const state = {
  symbolToPlace: {
    symbolId: 'test-symbol'
  }
}

const getters = {
}

/**
 * `Mutations` of the pattern editor.
 *
 * The following field is defined,
 * - `setSymbolToPlace`: {`function`}
 *   Sets the symbol to place to a given symbol.
 *   Takes an object that has the following field,
 *     - `symbolId`: {`string`}
 *       ID of the symbol to place.
 *
 * @member {object} mutations
 *
 * @memberof module:store.pattern-editor
 */
const mutations = {
  setSymbolToPlace (state, { symbolId }) {
    state.symbolToPlace.symbolId = symbolId
  }
}

const actions = {
}

export default {
  state,
  getters,
  mutations,
  actions
}

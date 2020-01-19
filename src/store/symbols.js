/**
 * `Vuex` model for the symbol registry.
 *
 * @namespace symbols
 *
 * @memberof module:store
 */

/* global process */

/**
 * `State` of the symbol registry.
 *
 * The following fields are defined,
 * - `requestedSymbolIds`: {`array<string>`}
 *   IDs of requested symbols.
 * - `registeredSymbols`: {`array<object>`}
 *   Registered symbols.
 *   Each element is an object that has the following fields,
 *     - `symbolId`: {`string`}
 *       ID of the symbol.
 *     - `svg`: {`SVGElement`}
 *       SVG element of the symbol.
 *
 * @member state
 *
 * @memberof module:store.symbols
 */
const state = {
  requestedSymbolIds: [],
  registeredSymbols: []
}

const getters = {}

/**
 * `Mutations` of the symbol registry.
 *
 * The following mutations are defined,
 * - `appendRequestedSymbolId`: {`function`}
 *   Appends a given symbol ID to `state.requestedSymbolIds`.
 *   Takes the following argument,
 *     - `symbolId`: {`string`}
 *       ID of the symbol to request.
 * - `registerSymbolSvg`: {`function`}
 *   Registers a given symbol.
 *   Takes the following argument,
 *     - `symbol`: {`object`}
 *       Symbol to be registered.
 *       Has the following fields,
 *         - `symbolId`: {`string`}
 *           ID of the symbol.
 *         - `svg`: {`SVGElement`}
 *           SVGElement representing the symbol.
 *
 *   **NOTE**: Does not checks if the symbol has already been registered.
 *
 * @member mutations
 *
 * @memberof module:store.symbols
 */
const mutations = {
  appendRequestedSymbolId (state, symbolId) {
    state.requestedSymbolIds.push(symbolId)
  },
  registerSymbolSvg (state, symbol) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Symbols]', 'registering symbol', symbol)
    }
    state.registeredSymbols.push(symbol)
  }
}

/**
 * `Actions` of the symbol registry.
 *
 * The following action is defined,
 * - `requestSymbol`: {`function`}
 *   Requests a given symbol.
 *   Loads the SVG associated with a given symbol ID.
 *   Takes an object that has the following field,
 *     - `symbolId`: {`string`}
 *       Symbol ID to request.
 *
 *   Returns nothing.
 *
 *   **NOTE**: Does nothing if a symbol associated with `symbolId` has already
 *   been requested.
 *
 * @member actions
 *
 * @memberof module:store.symbols
 */
const actions = {
  requestSymbol ({ commit, state }, { symbolId }) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[Symbols]', `requesting symbol: ${symbolId}`)
    }
    if (state.requestedSymbolIds.indexOf(symbolId) !== -1) {
      return
    }
    commit('appendRequestedSymbolId', symbolId)
    const parser = new DOMParser()
    const symbolPath = `symbols/${symbolId}.svg`
    fetch(symbolPath)
      .then(response => response.text())
      .then(svgText => {
        const XMLNS = 'http://www.w3.org/2000/svg'
        const symbolDoc = parser.parseFromString(svgText, 'image/svg+xml')
        const symbolSvg = symbolDoc.rootElement
        const symbolBody = symbolDoc.getElementById('symbol-body')
        symbolBody.remove()
        const symbol = symbolDoc.createElementNS(XMLNS, 'symbol')
        const ATTRS_TO_COPY = [
          'viewBox'
        ]
        ATTRS_TO_COPY.forEach(attr => {
          symbol.setAttribute(attr, symbolSvg.getAttribute(attr))
        })
        symbol.setAttribute('id', symbolId)
        symbol.appendChild(symbolBody)
        commit('registerSymbolSvg', {
          symbolId: symbolId,
          svg: symbol
        })
      })
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}

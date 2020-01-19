/**
 * Mixin for components that use symbols.
 *
 * This mixin introduces the following methods,
 * - `requestSymbol`
 *
 *   The `requestSymbol` [action]{@linkcode module:store.symbols.actions} of
 *   the {@linkcode module:store.symbols} store.
 * - `referenceSymbol`
 *
 *   Returns a reference ID for a specified symbol.
 *   Takes an object that has the following field,
 *     - `symbolId`: {`string`}
 *       ID of the symbol to reference.
 *
 *   Returns a reference ID associated with `symbolId`.
 *
 * @namespace symbol-user
 *
 * @memberof module:mixins
 */

import { mapActions } from 'vuex'

export default {
  methods: {
    ...mapActions('symbols', [
      'requestSymbol'
    ]),
    referenceSymbol ({ symbolId }) {
      this.requestSymbol({ symbolId })
      return `#${symbolId}`
    }
  }
}

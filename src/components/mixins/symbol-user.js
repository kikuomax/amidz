/**
 * Mixin for components that use symbols.
 *
 * @module symbol-user
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

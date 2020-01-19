<template>
  <defs>
    <symbol-definition
      v-for="symbol in registeredSymbols"
      :key="symbol.symbolId"
      :symbol-id="symbol.symbolId"
      :svg="symbol.svg"
    />
  </defs>
</template>

<script>
import { mapState } from 'vuex'

import SymbolDefinition from '@components/symbol-definition'

/**
 * Vue component representing a symbol registry.
 *
 * This component renders symbols defined in the `registeredSymbols`
 * [state]{@linkcode module:store.symbols.state}
 * of the {@linkcode module:store.symbols} store in a `defs` element.
 *
 * Each symbol is rendered with
 * the {@linkcode module:components.SymbolDefinition} component.
 *
 * @namespace SymbolRegistry
 *
 * @memberof module:components
 */
export default {
  name: 'SymbolRegistry',
  components: {
    SymbolDefinition
  },
  computed: {
    ...mapState('symbols', [
      'registeredSymbols'
    ])
  }
}
</script>

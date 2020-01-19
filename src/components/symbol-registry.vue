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

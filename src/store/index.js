import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import pattern from '@store/pattern'
import symbols from '@store/symbols'

export default new Vuex.Store({
  modules: {
    pattern: {
      ...pattern,
      namespaced: true
    },
    symbols: {
      ...symbols,
      namespaced: true
    }
  }
})

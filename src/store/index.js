/**
 * Root `Vuex` store of Amidz.
 *
 * @module store
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import pattern from '@store/pattern'
import patternEditor from '@store/pattern-editor'
import symbols from '@store/symbols'

export default new Vuex.Store({
  modules: {
    pattern: {
      ...pattern,
      namespaced: true
    },
    'pattern-editor': {
      ...patternEditor,
      namespaced: true
    },
    symbols: {
      ...symbols,
      namespaced: true
    }
  }
})

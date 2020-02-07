/**
 * Root `Vuex` store of Amidz.
 *
 * @module store
 */

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import { createStore as createPatternStore } from '@store/pattern'
import patternEditor from '@store/pattern-editor'
import symbols from '@store/symbols'

/**
 * Creates a root `Vuex` store.
 *
 * `promiseDb` must be resolved into an object like
 * [IDBDatabase]{@link https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase}.
 * To make this store testable, you can resolve it into a fake database
 * as long as it satisfies the interface described below.
 *
 * #### IDBDatabase
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase}
 *
 * The following function is required,
 * - [transaction]{@linkcode https://developer.mozilla.org/en-US/docs/Web/API/IDBDatabase/transaction}
 *
 *   Your implementation may return a fake
 *   [IDBTransaction]{@linkcode https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction}
 *   as long as it satisfies the interface described below.
 *
 * #### IDBTransaction
 *
 * See {@link https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction}
 *
 * @param {Promise} promisedDb
 *
 *   Promise that will be resolved into an object like `IDBDatabase`.
 *   See above.
 *
 * @return {Vuex}
 *
 *   Root `Vuex` store.
 */
export function createStore (promisedDb) {
  return new Vuex.Store({
    modules: {
      pattern: {
        ...createPatternStore(promisedDb),
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
}

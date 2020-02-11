import Vue from 'vue'
import Buefy from 'buefy'

import 'buefy/dist/buefy.css'

Vue.use(Buefy)

// experimental IndexedDB
const AMIDZ_DATABASE_NAME = 'AmidzDatabase'
const AMIDZ_DATABASE_VERSION = 1

/* global process */

const promisedDb = new Promise((resolve, reject) => {
  if (!window.indexedDB) {
    console.log('oh my goodness! no IndexedDB is available')
    reject(new Error('IndexedDB is not available'))
    return
  }
  const openRequest = window.indexedDB.open(
    AMIDZ_DATABASE_NAME,
    AMIDZ_DATABASE_VERSION)
  openRequest.onsuccess = function (event) {
    console.log('indexedDB.open', 'onsuccess', event)
    const { result: db } = event.target
    // closes the database when `versionchange` is fired, that is fired
    // when `deleteDatabase` is applied.
    // if you do not close the database in response to `deleteDatabase`,
    // E2E tests will block because they try to flush database every time.
    // https://github.com/kikuomax/amidz/issues/35#issuecomment-584646557
    db.onversionchange = event => {
      if (process.env.NODE_ENV !== 'production') {
        console.log('onversionchange', event)
      }
      db.close()
    }
    resolve(db)
  }
  openRequest.onerror = function (event) {
    console.log('indexedDB.open', 'onerror', event)
    resolve(new Error(`failed to open IndexedDB ${AMIDZ_DATABASE_NAME}`))
  }
  openRequest.onblocked = function (event) {
    console.log('indexedDB.open', 'onblocked', event)
    resolve(new Error(`IndexedDB ${AMIDZ_DATABASE_NAME} is blocked`))
  }
  openRequest.onupgradeneeded = function (event) {
    console.log('indexedDB.open', 'onupgradeneeded', event)
    const { result: db } = event.target
    const patternStore = db.createObjectStore(
      'pattern',
      {
        keyPath: 'name'
      })
    console.log('indexedDB.open', 'onupgradeneeded', patternStore)
    // populates a pattern
    const addRequest = patternStore.add({
      name: '$current',
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
    })
    addRequest.onsuccess = function (event) {
      console.log('patternStore.add', 'onsuccess', event)
    }
    addRequest.onerror = function (event) {
      console.log('patternStore.add', 'onerror', event)
    }
  }
})

import router from '@route'
import { createStore } from '@store'

import AppContainer from '@components/app-container'

new Vue({
  el: '#app',
  store: createStore(promisedDb),
  render: h => h(AppContainer),
  router
})

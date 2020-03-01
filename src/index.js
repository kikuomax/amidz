import Vue from 'vue'
import Buefy from 'buefy'
import VueI18n from 'vue-i18n'

import 'buefy/dist/buefy.css'

Vue.use(Buefy)
Vue.use(VueI18n)

import {
  populateStores,
  upgradeStores
} from '@db'

// experimental IndexedDB
const AMIDZ_DATABASE_NAME = 'AmidzDatabase'
const AMIDZ_DATABASE_VERSION = 2

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
    reject(new Error(`failed to open IndexedDB ${AMIDZ_DATABASE_NAME}`))
  }
  openRequest.onblocked = function (event) {
    console.log('indexedDB.open', 'onblocked', event)
    reject(new Error(`IndexedDB ${AMIDZ_DATABASE_NAME} is blocked`))
  }
  openRequest.onupgradeneeded = function (event) {
    console.log('indexedDB.open', 'onupgradeneeded', event)
    const { result: db } = event.target
    const { oldVersion, newVersion } = event
    if (oldVersion === 0) {
      // `oldVersion` should be 0 if there is no database.
      // https://developer.mozilla.org/en-US/docs/Web/API/IDBVersionChangeEvent/oldVersion
      populateStores(db, newVersion)
    } else {
      // db.transaction is not allowed during versionchange event.
      const { transaction } = openRequest
      upgradeStores(transaction, { oldVersion, newVersion })
    }
  }
})

import router from '@route'
import { createStore } from '@store'

import AppContainer from '@components/app-container'

import { messages } from '@i18n'

const locale = 'ja'
const i18n = new VueI18n({
  locale,
  messages
})

new Vue({
  el: '#app',
  store: createStore(promisedDb),
  render: h => h(AppContainer),
  i18n,
  router
})

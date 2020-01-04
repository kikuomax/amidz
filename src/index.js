import Vue from 'vue'

import router from '@route'

import AppContainer from '@components/app-container'

new Vue({
  el: '#app',
  render: h => h(AppContainer),
  router
})

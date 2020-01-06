import Vue from 'vue'

import 'bulma/css/bulma.css'

import router from '@route'

import AppContainer from '@components/app-container'

new Vue({
  el: '#app',
  render: h => h(AppContainer),
  router
})

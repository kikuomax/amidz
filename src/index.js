import Vue from 'vue'
import Buefy from 'buefy'

import 'buefy/dist/buefy.css'

Vue.use(Buefy)

import router from '@route'

import AppContainer from '@components/app-container'

new Vue({
  el: '#app',
  render: h => h(AppContainer),
  router
})

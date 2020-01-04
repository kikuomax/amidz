import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import MainScreen from '@components/main-screen'

const routes = [
  {
    path: '/',
    component: MainScreen
  }
]

export default new VueRouter({
  routes
})

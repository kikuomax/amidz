/**
 * `vue-router` model of Amidz.
 *
 * @module route
 */

import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

import EditorContainer from '@components/editor-container'
import MainScreen from '@components/main-screen'
import PatternEditor from '@components/pattern-editor'

const routes = [
  {
    path: '/',
    component: MainScreen,
    children: [
      {
        path: 'editor',
        component: EditorContainer,
        children: [
          {
            path: 'pattern',
            component: PatternEditor
          }
        ]
      }
    ]
  }
]

const router = new VueRouter({
  routes
})
// default route.
// https://github.com/vuejs/vue-router/issues/866#issuecomment-258067649
router.replace('/editor/pattern')

export default router

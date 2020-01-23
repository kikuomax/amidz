import { createLocalVue, shallowMount } from '@vue/test-utils'
import sinon from 'sinon'
import Vue from 'vue'
import Vuex from 'vuex'

import symbolUser from '@components/mixins/symbol-user'

// createLocalVue to avoid the global Vue instance is affected.
const localVue = createLocalVue()
localVue.use(Vuex)

/* global expect */
describe('symbol-user mixin to App', function () {
  let actions
  let store
  let model

  const App = Vue.component('app', {
    template: '<div />',
    mixins: [
      symbolUser
    ]
  })

  beforeEach(function () {
    actions = {
      requestSymbol: sinon.spy()
    }
    store = new Vuex.Store({
      modules: {
        symbols: {
          namespaced: true,
          actions: actions
        }
      }
    })
  })

  describe('App.referenceSymbol({symbolId:"test-symbol"})', function () {
    let wrapper
    const symbol = {
      symbolId: 'test-symbol'
    }

    beforeEach(function () {
      wrapper = shallowMount(App, {
        store,
        localVue
      })
    })

    it('should return "#test-symbol"', function () {
      expect(wrapper.vm.referenceSymbol(symbol)).to.equal('#test-symbol')
    })

    it('should call `requestSymbol({symbolId:"test-symbol"})` of the `symbols` store', function () {
      wrapper.vm.referenceSymbol(symbol)
      expect(actions.requestSymbol).to.have.been.calledOnce
      expect(actions.requestSymbol.getCall(0).args[1]).to.deep.equal(symbol)
    })
  })

  describe('App.referenceSymbol({symbolId:"another-symbol"})', function () {
    let wrapper
    const symbol = {
      symbolId: 'another-symbol'
    }

    beforeEach(function () {
      wrapper = shallowMount(App, {
        store,
        localVue
      })
    })

    it('should return "#aother-symbol"', function () {
      expect(wrapper.vm.referenceSymbol(symbol)).to.equal('#another-symbol')
    })

    it('should call `requestSymbol({symbolId:"another-symbol"})` of the `symbols` store', function () {
      wrapper.vm.referenceSymbol(symbol)
      expect(actions.requestSymbol).to.have.been.calledOnce
      expect(actions.requestSymbol.getCall(0).args[1]).to.deep.equal(symbol)
    })
  })
})

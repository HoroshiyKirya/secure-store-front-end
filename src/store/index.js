import Vue from 'vue'
import Vuex  from 'vuex'

Vue.use(Vuex)

import UserStore from './UserStore'
import ShopStore from './ShopStore'
import KernelStore from './KernelStore'

import ViewProduct from './ViewProduct'

export default new Vuex.Store({
  modules: {
    user:   UserStore,
    kernel: KernelStore,
    shop:   ShopStore,
    ViewProduct
  },
  state: {},
  mutations: {

  },
  actions: {

  }
})

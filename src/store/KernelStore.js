import api from '@/api'
import { MUTATIONS as SHOP_MUTATIONS } from './ShopStore'

export const ACTIONS = {
  PRODUCTS: {
    CATEGORY_ADD: 1,
    SUBCATEGORY_ADD: 2,
    PARAM_ADD: 3,
    ADD: 4,
  },
  ACCOUNTING: {
    LOAD_PRODUCTS_FOR_SUBCATEGORY_ALL: 1,
    CHANGE_PRODUCT_AMOUNT: 2,
  }
}

const MUTATIONS = {
  PRODUCTS: {},
  ACCOUNTING: {
    SET_PRODUCTS_FOR_SUBCATEGORY_ALL: 1,
  },
}

const ModuleProducts = {
  namespaced: true,
  state: {},
  getters: {},
  mutations: {},
  actions: {
    [ACTIONS.PRODUCTS.ADD] ({ commit, state }, payload) {
      console.log('kernel/products/add', payload)
      return new Promise((resolve, reject) => {
        api.v1.kernel.products.add({ ...payload }).then(response => {
          
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('kernel/products/add <error> ', err))
    },
    [ACTIONS.PRODUCTS.CATEGORY_ADD] ({ commit, state }, payload) { 
      console.log('kernel/products/category-add', payload)
      return new Promise((resolve, reject) => {
        api.v1.kernel.products.addCategory({ title: payload }).then(response => {
          console.log('kernel/products/category-add->', response)
          commit(`shop/${SHOP_MUTATIONS.SET_MAP}`, response.data.map, {root:true})
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('kernel/products/category-add <error> ', err))
    },
    [ACTIONS.PRODUCTS.SUBCATEGORY_ADD] ({ commit, state }, payload) { 
      console.log('kernel/products/subcategory-add', payload)
      return new Promise((resolve, reject) => {
        api.v1.kernel.products.addSubcategory({ title: payload.title, parent: payload.parent }).then(response => {
          console.log('kernel/products/subcategory-add->', response)
          commit(`shop/${SHOP_MUTATIONS.SET_MAP}`, response.data.map, {root:true})
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('kernel/products/subcategory-add <error> ', err))
    },
    [ACTIONS.PARAM_ADD] ({ commit, state }, payload) {
      console.log('kernel/products/param-add', payload)
      return new Promise((resolve, reject) => {
        api.v1.kernel.products.addParam({ ...payload }).then(response => {
          console.log('kernel/products/param-add->', response)
          commit(`shop/${SHOP_MUTATIONS.SET_PARAMS_MAP}`, response.data.map, {root:true})
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('kernel/products/param-add <error> ', err))
    },


  },
}
const ModuleAccounting = {
  namespaced: true,
  state: {
    productsForSubcategoryAll: null,
  },
  getters: {},
  mutations: {
    [MUTATIONS.ACCOUNTING.SET_PRODUCTS_FOR_SUBCATEGORY_ALL]: (state, payload) => state.productsForSubcategoryAll = payload,
  },
  actions: {
    [ACTIONS.ACCOUNTING.CHANGE_PRODUCT_AMOUNT] ({ commit, state }, payload) {
      console.log('kernel/accounting/change-product-amount', payload)
      return new Promise((resolve, reject) => {
        api.v1.kernel.shop.accounting.setProductAmount(payload).then(response => {
          console.log('kernel/accounting/change-product-amount->', response)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('kernel/accounting/change-product-amount <error> ', err))
    },
    [ACTIONS.ACCOUNTING.LOAD_PRODUCTS_FOR_SUBCATEGORY_ALL] ({ commit, state }, payload) {
      console.log('kernel/accounting/load-proucts-for-subcategory', payload)
      return new Promise((resolve, reject) => {
        api.v1.shop.products.getAll(payload).then(response => {
          console.log('kernel/accounting/load-proucts-for-subcategory->', response)
          commit(`${MUTATIONS.ACCOUNTING.SET_PRODUCTS_FOR_SUBCATEGORY_ALL}`, response.data.products)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('kernel/accounting/load-proucts-for-subcategory <error> ', err))
    },
  }
}

export default {
  namespaced: true,
  modules: {
    products: ModuleProducts,
    accounting: ModuleAccounting,
  },
  state: {},
  getters: {},
  mutations: {},
  actions: {},
}

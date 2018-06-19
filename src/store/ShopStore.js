import api from '@/api'
import { MUTATIONS as USER_MUTATIONS } from './UserStore'

export const ACTIONS = {
  LOAD_MAP: 1,
  LOAD_PARAMS_MAP: 2,
  LOAD_SERVICES: 3,
  GET_PRODUCTS_BY_SUBCATEGORY: 4,
  GET_PRODUCTS_FROM_QUERY: 5,
  ORDERS:{
    GET: 10,
    MAKE_PRODUCT_ORDER: 11,
    MAKE_CALL_ORDER: 12,
    MAKE_SERVICE_ORDER: 13,
  }
}

export const MUTATIONS = {
  SET_MAP: 1,
  SET_PARAMS_MAP: 2,
  SET_CURRENT_PRODUCTS: 3,
  SET_CURRENT_CATEGORY: 5,
  SET_CURRENT_SUBCATEGORY: 6,
  SET_SERVICES: 7,
}

const OrdersModule = {
  namespaced: true,
  actions: {
    [ACTIONS.ORDERS.GET] ({ commit, state }, payload) {

    },
    [ACTIONS.ORDERS.MAKE_PRODUCT_ORDER] ({ commit, state }, payload) {
      console.log('shop/orders/make-product-order', payload)
      return new Promise((resolve, reject) => {
        api.v1.shop.orders.makeProductOrder(payload).then(response => {
          console.log('shop/orders/make-product-order->', response)
          commit(`user/${USER_MUTATIONS.SET_CART}`, response.data.cart, {root:true})
          resolve({ isError: response.data.error ? true : false, order:response.data.order })
        })
      }).catch(err => console.log('shop/orders/make-product-order <error> ', err))
    },
    [ACTIONS.ORDERS.MAKE_CALL_ORDER] ({ commit, state }, payload) {
      console.log('shop/orders/make-call-order', payload)
      return new Promise((resolve, reject) => {
        api.v1.shop.orders.makeCallOrder(payload).then(response => {
          console.log('shop/orders/make-call-order->', response)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('shop/orders/make-call-order <error> ', err))
    },
    [ACTIONS.ORDERS.MAKE_SERVICE_ORDER] ({ commit, state }, payload) {
      console.log('shop/orders/make-service-order', payload)
      return new Promise((resolve, reject) => {
        api.v1.shop.orders.makeServiceOrder(payload).then(response => {
          console.log('shop/orders/make-service-order', response)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('shop/orders/make-service-order <error> ', err))
    }
  }
}

export default {
  namespaced: true,
  modules: {
    orders: OrdersModule
  },
  state: {
    map: null,
    paramsMap: null,
    services: null,
    currentProducts: null,
    currentCategoryData: null,
    currentSubcategoryData: null,
  },
  getters: {
    currentCategoryTitle: state => state.currentCategoryData ? state.currentCategoryData.title : '',
    currentSubcategoryTitle: state => state.currentSubcategoryData ? state.currentSubcategoryData.title : '',
    isProductsLoaded: state => state.currentProducts === null ? false : true,
    serviceByServiceName: state => name => state.services.find(e => e.service === name),
    subcategoryTitleFromId: state => id => {
      let title 
      state.map.find(e => {
        let f = e.subcategories.find(s => s._id == id)
        if(f) title = f.title
      })
      return title
    },
    currentProductsFiltersMap: state => {
      let filters = {
        subcategories: [],
        params: [],
      }
      const paramsGlobalFilterable = state.paramsMap.global.filter(e => e.filterable !== false)
      state.currentProducts.forEach(prod => {
        if(filters.subcategories.findIndex(e=>e===prod.fromSubcategory) === -1) filters.subcategories.push(prod.fromSubcategory)
        const paramsForProductSubcategory = state.paramsMap.local.find(e => e._id === prod.fromSubcategory).params.filter(e => e.type !== 'secondary')
        const totalParams = paramsGlobalFilterable.concat(paramsForProductSubcategory)
        //console.log('totalParams',  totalParams)
        prod.params.forEach(prm => {
          const paramDescriptor = totalParams.find(e => e._id === prm.paramId)
          //if(paramDescriptor.filterable === false) return
          if(!paramDescriptor) return
          if(filters.params.findIndex(e => e.paramId === prm.paramId) === -1) {
            filters.params.push({
              paramId: prm.paramId,
              title: paramDescriptor.title,
              type: paramDescriptor.valueType,
              values: [],
              valueFrom: parseInt(prm.value),
              valueTo: parseInt(prm.value),
            })
          }
          let paramFilter = filters.params.find(e => e.paramId === prm.paramId)
          ////////
          if(paramFilter.type === 'string') {
            if(paramFilter.values.findIndex(e => e.toUpperCase() === prm.value.toUpperCase()) === -1) paramFilter.values.push(prm.value)
          }
          if(paramFilter.type === 'number') {
            if(parseInt(prm.value) > paramFilter.valueTo) paramFilter.valueTo = parseInt(prm.value)
            else if(parseInt(prm.value) < paramFilter.valueFrom) paramFilter.valueFrom = parseInt(prm.value)
          }  
        })
      })
      //console.log('filters',filters)
      return filters
    },
    currentProductsFromFilters: state => filters => {
      //console.log('call filt', filters) 
      if(!filters) return state.currentProducts
      let filteredProducts = state.currentProducts
      if(filters.subcategories.length > 0) {
        filteredProducts = filteredProducts.filter(e => filters.subcategories.findIndex(x => x == e.fromSubcategory) != -1)
      }
      if(Object.keys(filters.params).length > 0) {
        const paramsGlobalFilterable = state.paramsMap.global.filter(e => e.filterable !== false)
        filteredProducts = filteredProducts.filter(prd => {
          const paramsForProductSubcategory = state.paramsMap.local.find(e => e._id === prd.fromSubcategory).params.filter(e => e.type !== 'secondary')
          const totalParams = paramsGlobalFilterable.concat(paramsForProductSubcategory)
          let isSatisfies = true
          Object.keys(filters.params).forEach(fparamId => {
            if(!isSatisfies) return
            const fprmData = filters.params[fparamId]
            const paramDescriptor = totalParams.find(e => e._id == fparamId)
            const productParam = prd.params.find(x => x.paramId == fparamId)
            if(!productParam) return isSatisfies = false
            if(paramDescriptor.valueType == 'string') {
              //console.log('xx', fprmData, productParam)
              isSatisfies = isSatisfies && (fprmData.findIndex(e => e == productParam.value) != -1)
            }
            if(paramDescriptor.valueType == 'number') {
              let nVal = parseInt(productParam.value)
              isSatisfies = isSatisfies && (nVal >= fprmData.from && nVal <= fprmData.to)
            }
          })
          return isSatisfies
        })
      }
      return filteredProducts
    }
  },
  mutations: {
    [MUTATIONS.SET_MAP]: (state, payload) => state.map = payload,
    [MUTATIONS.SET_PARAMS_MAP]: (state, payload) => state.paramsMap = payload,
    [MUTATIONS.SET_SERVICES]: (state, payload) => state.services = payload,
    [MUTATIONS.SET_CURRENT_PRODUCTS]: (state, payload) => state.currentProducts = payload,
    [MUTATIONS.SET_CURRENT_CATEGORY]: (state, payload) => state.currentCategoryData = payload,
    [MUTATIONS.SET_CURRENT_SUBCATEGORY]: (state, payload) => state.currentSubcategoryData = payload,
  },
  actions: {
    [ACTIONS.LOAD_MAP] ({ commit, state }, payload) {
      console.log('shop/getmap', payload)
      return new Promise((resolve, reject) => {
        api.v1.shop.map().then(response => {
          console.log('shop/getmap->', response)
          if(response.data.error) reject(response.data.error)
          else commit(`${MUTATIONS.SET_MAP}`, response.data.map)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('shop/getmap <error> ', err))
    },
    [ACTIONS.LOAD_PARAMS_MAP] ({ commit, state }, payload) {
      console.log('shop/load-param-map', payload)
      return new Promise((resolve, reject) => {
        api.v1.shop.paramsMap().then(response => {
          console.log('shop/load-param-map->', response)
          commit(`${MUTATIONS.SET_PARAMS_MAP}`, response.data.map)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('shop/load-param-map <error> ', err))
    },
    [ACTIONS.GET_PRODUCTS_BY_SUBCATEGORY] ({ commit, state }, payload) {
      console.log('shop/get-products-by-subcategory', payload)
      const category    = state.map.find(e=>e.path===payload.categoryPath)
      const subcategory = category.subcategories.find(e=>e.path===payload.subcategoryPath)
      commit(`${MUTATIONS.SET_CURRENT_CATEGORY}`, category)
      commit(`${MUTATIONS.SET_CURRENT_SUBCATEGORY}`, subcategory)
      commit(`${MUTATIONS.SET_CURRENT_PRODUCTS}`, null)
      return new Promise((resolve, reject) => {
        api.v1.shop.products.get({subcategory:subcategory._id}).then(response => {
          console.log('shop/set-category-and-subcategory->', response)
          commit(`${MUTATIONS.SET_CURRENT_PRODUCTS}`, response.data.products)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('shop/set-category-and-subcategory <error> ', err))
    },
    [ACTIONS.GET_PRODUCTS_FROM_QUERY] ({ commit, state }, payload) {
      console.log('shop/set-products-from-query', payload)
      commit(`${MUTATIONS.SET_CURRENT_CATEGORY}`, null)
      commit(`${MUTATIONS.SET_CURRENT_SUBCATEGORY}`, null)
      commit(`${MUTATIONS.SET_CURRENT_PRODUCTS}`, null)
      return new Promise((resolve, reject) => {
        api.v1.shop.products.get({query:payload}).then(response => {
          console.log('shop/shop/set-products-from-query->', response)
          commit(`${MUTATIONS.SET_CURRENT_PRODUCTS}`, response.data.products)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('shop/set-products-from-query <error> ', err))
    },
    [ACTIONS.LOAD_SERVICES] ({ commit, state }, payload) {
      console.log('shop/load-services', payload)
      return new Promise((resolve, reject) => {
        api.v1.shop.services().then(response => {
          console.log('shop/load-services->', response)
          commit(`${MUTATIONS.SET_SERVICES}`, response.data.services)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('shop/load-services <error> ', err))
    }
  },
}

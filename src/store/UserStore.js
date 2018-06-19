import api from '@/api'

export const ACTIONS = {
  PERFORM_REGISTER: 1,
  PERFORM_LOGIN: 2,
  PERFORM_AUTH: 3,
  PERFORM_LOGOUT: 4,
  FAVS: {
    ADD: 11,
    REMOVE: 12
  },
  CART: {
    ADD: 21,
    REMOVE: 22
  }
}

export const MUTATIONS = {
  SET_USER_DATA: 1,
  SET_LOGIN_ERROR: 2,
  SET_REGISTER_ERROR: 3,
  SET_LOAD_AWAIT: 4,
  SET_CART: 5,
  SET_FAVS: 6,
  FAVS: {
    SET_UPDATE_STATUS: 21
  },
  CART: {
    SET_UPDATE_STATUS: 22
  }
}

const ModuleFavs = {
  namespaced: true,
  state: {
    onUpdate: false,
  },
  getters: {
    isAlreadyContain: (state, getters, globalState) => productId => {
      return globalState.user.favsProducts ? globalState.user.favsProducts.list.findIndex(e => e === productId) === -1 ? false : true : false
    }
  },
  mutations: {
    [MUTATIONS.FAVS.SET_UPDATE_STATUS]: (state, payload) => state.onUpdate = payload
  },
  actions: {
    [ACTIONS.FAVS.ADD] ({ commit, state }, payload) {
      console.log('user/favs/add', payload)
      commit(`${MUTATIONS.FAVS.SET_UPDATE_STATUS}`, true)
      return new Promise((resolve, reject) => {
        api.v1.user.favorites.add(payload).then(response => {
          console.log('user/favs/add->', response)
          commit(`${MUTATIONS.FAVS.SET_UPDATE_STATUS}`, true)
          commit(`user/${MUTATIONS.SET_FAVS}`, response.data.favorites, {root:true})
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('user/favs/add <error> ', err))
    },
    [ACTIONS.FAVS.REMOVE] ({ commit, state }, payload) {
      console.log('user/favs/remove', payload)
      commit(`${MUTATIONS.FAVS.SET_UPDATE_STATUS}`, true)
      return new Promise((resolve, reject) => {
        api.v1.user.favorites.remove(payload).then(response => {
          console.log('user/favs/remove->', response)
          commit(`${MUTATIONS.FAVS.SET_UPDATE_STATUS}`, true)
          commit(`user/${MUTATIONS.SET_FAVS}`, response.data.favorites, {root:true})
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('user/favs/remove <error> ', err))
    },
  },
}
const ModuleCart = {
  namespaced: true,
  state: {
    onUpdate: false,
  },
  getters: {
    isAlreadyContain: (state, getters, globalState) => productId => {
      return globalState.user.cartProducts ? globalState.user.cartProducts.list.findIndex(e => e.productId === productId) === -1 ? false : true : false
    }
  },
  mutations: {
    [MUTATIONS.CART.SET_UPDATE_STATUS]: (state, payload) => state.onUpdate = payload
  },
  actions: {
    [ACTIONS.CART.ADD] ({ commit, state }, payload) {
      console.log('user/cart/add', payload)
      commit(`${MUTATIONS.CART.SET_UPDATE_STATUS}`, true)
      return new Promise((resolve, reject) => {
        api.v1.user.cart.add(payload).then(response => {
          console.log('user/cart/add->', response)
          commit(`${MUTATIONS.CART.SET_UPDATE_STATUS}`, true)
          commit(`user/${MUTATIONS.SET_CART}`, response.data.cart, {root:true})
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('user/cart/add <error> ', err))
    },
    [ACTIONS.CART.REMOVE] ({ commit, state }, payload) {
      console.log('user/cart/remove', payload)
      commit(`${MUTATIONS.CART.SET_UPDATE_STATUS}`, true)
      return new Promise((resolve, reject) => {
        api.v1.user.cart.remove(payload).then(response => {
          console.log('user/cart/remove->', response)
          commit(`${MUTATIONS.CART.SET_UPDATE_STATUS}`, true)
          commit(`user/${MUTATIONS.SET_CART}`, response.data.cart, {root:true})
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('user/cart/remove <error> ', err))
    },
  },
}

export default {
  namespaced: true,
  modules: {
    favs: ModuleFavs,
    cart: ModuleCart,
  },
  state: {
    login: null,
    email: null,
    role: null,
    cartProducts: null,
    favsProducts: null,
    loginError: null,
    registerError: null,
    onLoadAwait: false,
  },
  getters: {
    ifAuthorized: state => state.login !== null
  },
  mutations: {
    [MUTATIONS.SET_USER_DATA] (state, payload) {
      console.log('set set', payload)
      state.login = payload.login
      state.email = payload.email
      state.role = payload.role
      state.cartProducts = payload.cart
      state.favsProducts = payload.favorites
    },
    [MUTATIONS.SET_REGISTER_ERROR]: (state, payload) => state.registerError = payload,
    [MUTATIONS.SET_LOGIN_ERROR]:    (state, payload) => state.loginError = payload,
    [MUTATIONS.SET_LOAD_AWAIT]:     (state, payload) => state.onLoadAwait = payload,
    [MUTATIONS.SET_CART]:           (state, payload) => state.cartProducts = payload,
    [MUTATIONS.SET_FAVS]:           (state, payload) => state.favsProducts = payload,
  },
  actions: {
    [ACTIONS.PERFORM_REGISTER] ({ commit, state }, payload) { 
      console.log('user/register', payload)
      commit(`${MUTATIONS.SET_REGISTER_ERROR}`, null)
      commit(`${MUTATIONS.SET_LOAD_AWAIT}`, true)
      return new Promise((resolve, reject) => {
        api.v1.user.register(payload).then(response => {
          console.log('user/register ->', response)
          commit(`${MUTATIONS.SET_LOAD_AWAIT}`, false)
          if(response.data.error) commit(`${MUTATIONS.SET_REGISTER_ERROR}`, response.data.error)
          else commit(`${MUTATIONS.SET_USER_DATA}`, response.data.user)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('user/register <error> ', err))
    },
    [ACTIONS.PERFORM_LOGIN] ({ commit, state }, payload) {
      console.log('user/login', payload)
      commit(`${MUTATIONS.SET_LOGIN_ERROR}`, null)
      commit(`${MUTATIONS.SET_LOAD_AWAIT}`, true)
      return new Promise((resolve, reject) => {
        api.v1.user.login(payload).then(response => {
          console.log('user/rlogin ->', response)
          commit(`${MUTATIONS.SET_LOAD_AWAIT}`, false)
          if(response.data.error) commit(`${MUTATIONS.SET_LOGIN_ERROR}`, response.data.error)
          else commit(`${MUTATIONS.SET_USER_DATA}`, response.data.user)
          resolve({ isError: response.data.error ? true : false })
        })
      }).catch(err => console.log('user/login <error> ', err))
    },
    [ACTIONS.PERFORM_AUTH] ({ commit, state }, payload) {
      console.log(arguments)
      console.log('user/auth')
      commit(`${MUTATIONS.SET_LOAD_AWAIT}`, true)
      return new Promise((resolve, reject) => {
        api.v1.user.auth().then(response => {
          console.log('user/auth ->', response)
          commit(`${MUTATIONS.SET_LOAD_AWAIT}`, false)
          if(response.data.error) return resolve({ isError: true })
          if(response.data.isAuthenticated) commit(`${MUTATIONS.SET_USER_DATA}`, response.data.user)
          resolve({ isError: false })
        })
      }).catch(err => console.log('user/auth <error> ', err))
    },
    [ACTIONS.PERFORM_LOGOUT] ({ commit, state }, payload) {
      console.log('user/logout')
      commit(`${MUTATIONS.SET_LOAD_AWAIT}`, true)
      return new Promise((resolve, reject) => {
        api.v1.user.logout().then(response => {
          commit(`${MUTATIONS.SET_LOAD_AWAIT}`, false)
          console.log('user/logout ->', response)
          if(response.data.error) return resolve({ isError: true })
          if(response.data.success) commit(`${MUTATIONS.SET_USER_DATA}`, { login: null, email: null, cart: null, favorites: null, role:null })
          resolve({ isError: false })
        })
      }).catch(err => console.log('user/logout <error> ', err))
    },
  },
}

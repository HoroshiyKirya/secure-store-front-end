import Vue from 'vue'
import App from './App'

import Router from 'vue-router'
import router from './router'

import Vuex  from 'vuex'
import store from './store'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
Vue.use(Vuetify, {
  theme: {
    primary: '#e01a4f',
  }
})


import 'mdi/css/materialdesignicons.min.css'


Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

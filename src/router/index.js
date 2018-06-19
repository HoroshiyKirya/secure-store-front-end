import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import page404 from '@/views/page404'
import Home from '@/views/Home'
import About from '@/views/About'
import Catalog from '@/views/Catalog'
import Product from '@/views/Product'
import Admin from '@/views/Admin'
import Cart from '@/views/Cart'
import Favorites from '@/views/Favorites'
import Orders from '@/views/Orders'

export default new Router({
  mode: 'history',
  routes: [
    { path: '*', component: page404, meta: { persistent: true } }, //error 404
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: '/catalog/:categoryPath/:subcategoryPath',
      name: 'catalog',
      component: Catalog,
    },
    {
      path: '/catalog/search',
      name: 'catalog_search',
      component: Catalog,
    },
    {
      //path: '/product/:productId(\\d+)',
      path: '/product/:productId',
      name: 'product',
      component: Product
    },
    {
      path:'/admin',
      name:'admin',
      component: Admin
    },
    {
      path:'/cart',
      name:'cart',
      component: Cart
    },
    {
      path:'/favorites',
      name:'favorites',
      component: Favorites
    },
    {
      path: '/orders',
      name: 'orders',
      component: Orders,
    }
  ]
})

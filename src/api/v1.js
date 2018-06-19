import axios from 'axios'

const API_URI = 'localhost:3000'
const doTrot = e => new Promise((resolve) => setTimeout(()=>resolve(e), 500))
const apiFetch = endpoint => fetch(`${API_URI}/v1/${endpoint}`).then(response => response.json()).then(doTrot)

const apiGet    = (endpoint, data) => axios.get(`${API_URI}/v1/${endpoint}`, data).then(response => response).then(doTrot)
const apiPost   = (endpoint, data) => axios.post(`${API_URI}/v1/${endpoint}`, data).then(response => response).then(doTrot)
const apiDelete = (endpoint, data) => axios.delete(`${API_URI}/v1/${endpoint}`, data).then(response => response).then(doTrot)

export default {
  user: {
    auth:     payload => apiGet('user/auth'),
    login:    payload => apiPost('user/login', { login: payload.login, password: payload.password }),
    register: payload => apiPost('user/register', { login: payload.login, email: payload.email, password: payload.password }),
    logout:   payload => apiPost('user/logout'),
    favorites: {
      get:    payload => apiGet('user/favorites'),
      add:    payload => apiPost('user/favorites', { product_id: payload }),
      remove: payload => apiDelete('user/favorites', { data: {product_id: payload}})
    },
    cart: {
      get:    payload => apiGet('user/cart'),
      add:    payload => apiPost('user/cart', { product_id: payload.id, amount: payload.amount }),
      remove: payload => apiDelete('user/cart', { data: {product_id: payload}})
    },
  },
  shop: {
    products: {
      get:        payload => apiGet('shop/products', {params:{subcategory:payload.subcategory,query:payload.query}}), // available for subcategory
      getAll:     payload => apiGet('shop/products/all', {params:{subcategory:payload}}), // all for subcategory
    },
    map:          payload => apiGet('shop/map'),
    services:     payload => apiGet('shop/services'),
    paramsMap:    payload => apiGet('shop/params'),
    productInfo:  payload => apiGet(`shop/product/${payload}`),
    productComment:payload => apiPost('shop/product/comment', payload),
    orders: {
      get:              payload => apiGet('shop/orders'),
      makeProductOrder: payload => apiPost('shop/orders', payload),
      makeCallOrder:    payload => apiPost('shop/orders/call', {phone:payload.phone,name:payload.name}),
      makeServiceOrder: payload => apiPost('shop/orders/service', payload)
    },
  },
  kernel: {
    shop: {
      orders: {
        products: payload => apiGet('kernel/shop/orders/products'),
        calls:    payload => apiGet('kernel/shop/orders/calls'),
        service:  payload => apiGet('kernel/shop/orders/service'),
      },
      accounting: {
        get:              payload => apiGet('kernel/shop/accounting'),
        setProductAmount: payload => apiPost('kernel/shop/accounting', payload)
      }
    },
    products: {
      add: payload => {
        var data = new FormData()
        data.append('image', payload.image)
        data.append('fromSubcategory', payload.fromSubcategory)
        data.append('params', JSON.stringify(payload.params))
        data.append('title', payload.title)
        return apiPost('kernel/products', data)
      },
      addCategory:      payload => apiPost('kernel/products/category', { title: payload.title }),
      addSubcategory:   payload => apiPost('kernel/products/category', { title: payload.title, parent: payload.parent }),
      addParam:         payload => apiPost('kernel/products/params', payload),
      comments: {
        remove:         payload => apiDelete('kernel/product/comment/remove', { data: payload})
      }
    },
    users: {}
  }
}
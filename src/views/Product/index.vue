<template lang="pug">
v-container(v-if="!_dataLoaded")
  v-layout(justify-center): v-progress-circular.mt-5(indeterminate color="primary" size="48")
v-container(v-else)
  OnlyForAuthorized(ref="onlyForAuthSnack")
  //-Breadcrumbs(:items="[{text: 'Домофоны и интеркомы'},{ text: 'Видеодомофоны',},{text: data.title,}]") 
  div.mt-3.headline.grey--text.text--darken-3(style="text-transform: uppercase;") {{productData.literals.brand}} {{productData.title}}
  v-layout.mt-2
    //-WarrantyProvider(:value="data.warranty")
  v-layout.mt-3(:column="$vuetify.breakpoint.smAndDown")
    v-layout(md10 :column="$vuetify.breakpoint.mdAndDown")
      v-flex.white(md4 lg7)
        v-layout(justify-center align-center)
          img(:src="`http://localhost:3000/uploads/products/${productData.image}`" style="max-width:100%;max-height:100%")
      v-flex.px-3.pb-3(md6 lg5)
        div.caption {{productData.literals.description}}
    v-flex(md2) 
      v-card.custom-product-views-control-panel.pt-3.pb-2
        h5.px-3.caption.grey--text цена товара
        div.px-3
          PriceProvider.custom-product-views-control-panel-price(:value="productData.literals.price")
        v-divider.mt-2.mb-3
        h5.px-3.caption.grey--text цена монтажа
        div.px-3
          PriceProvider.custom-product-views-control-panel-price-secondary.grey--text.text--darken-3(:value="productData.literals.price_mount")
        v-divider.mt-2.mb-3
        div.px-3
          v-btn(color="primary", block, :disabled="_isAlreadyInCart" @click="_handleCartAdd", :loading="addOnAwait") 
            div(v-if="!_isAlreadyInCart") Купить
            div(v-else) В корзине
        div.px-3.mt-2
          v-btn(block flat @click="_handleFavsAdd", :loading="favOnAwait", :disabled="_isAlreadyInFav")
            div(v-if="_isAlreadyInFav") в избранном
            div(v-else) в избранное
            v-icon(dark right v-if="_isAlreadyInFav") mdi-star
            v-icon(dark right v-else) mdi-star-outline
  v-layout(column).mt-2
    v-tabs.mt-3(v-model="tabsm" slider-color="primary")
      v-tab Характеристики
      v-tab Отзывы
      v-tab-item
        v-card(flat)
          Product_SpecsView(:params="_secondaryParams")
      v-tab-item
        v-card(flat)
          Product_CommentsView(:onnewcomments="_handleNewComments", :product="productData")
</template>

<script>
import { ACTIONS as USER_ACTIONS } from '@/store/UserStore'
import Breadcrumbs from '@/views-partials/Breadcrumbs'
import PriceProvider from '@/views-partials/PriceProvider'
import WarrantyProvider from '@/views-partials/WarrantyProvider'
import OnlyForAuthorized from '@/views-partials/feedback/OnlyForAuthorized'
import api from '@/api'

import Product_CommentsView from './_CommentsView'
import Product_SpecsView from './_SpecsView'
export default {
  components: {
    PriceProvider,
    WarrantyProvider,
    Breadcrumbs,
    Product_CommentsView,
    Product_SpecsView,
    OnlyForAuthorized,
  },
  data: () => ({
    tabsm: null,
    productData: null,
    addOnAwait: false,
    favOnAwait: false,
  }),
  methods: {
    _handleCartAdd() {
      if(!this.$store.getters['user/ifAuthorized']) return this.$refs.onlyForAuthSnack.show()
      this.addOnAwait = true
      this.$store.dispatch(`user/cart/${USER_ACTIONS.CART.ADD}`, {
        id: this.productData._id,
        amount: 1
      }).then(status => {
        this.addOnAwait = false
      })
    },
    _handleFavsAdd() {
      if(!this.$store.getters['user/ifAuthorized']) return this.$refs.onlyForAuthSnack.show()
      this.favOnAwait = true
      this.$store.dispatch(`user/favs/${USER_ACTIONS.FAVS.ADD}`, this.productData._id).then(status => {
        this.favOnAwait = false
      })
    },
    _handleNewComments(nc) {
      this.productData = nc
    }
  },
  computed: {
    _isAlreadyInCart() { return this.$store.getters['user/cart/isAlreadyContain'](this.productData._id) },
    _isAlreadyInFav() { return this.$store.getters['user/favs/isAlreadyContain'](this.productData._id) },
    _dataLoaded() { return this.productData !== null },
    _secondaryParams() {
      if(!this.$store.state.shop.paramsMap) return []
      const secondaryLocalParams = this.$store.state.shop.paramsMap.local.find(e => e._id === this.productData.fromSubcategory).params.filter(e => e.type === 'secondary')
      const prdSecondaryParams = this.productData.params.filter(e => secondaryLocalParams.findIndex(s => s._id === e.paramId) !== -1)
      return prdSecondaryParams.map(e => ({value: e.value, param: secondaryLocalParams.find(s => s._id === e.paramId)}))
    }
  },
  mounted() {
    api.v1.shop.productInfo(this.$route.params.productId).then(response => {
      this.productData = response.data.info
    })
  }
}
</script>

<style lang="sass">
.custom-product-views
  &-control-panel
    &-price
      text-align: center
      font-weight: 900
      font-size: 24px
    &-price-secondary
      text-align: center
      font-size: 24px
      font-weight: 300
</style>


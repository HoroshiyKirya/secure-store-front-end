<template lang="pug">
div
  OnlyForAuthorized(ref="onlyForAuthSnack")
  v-data-iterator(content-tag="v-layout" column :items="this.$store.getters['shop/currentProductsFromFilters'](filters)", :pagination.sync="pagination" hide-actions)
    ProductCardFull.mb-2(slot="item" slot-scope="props", :data="props.item", :to="'/product/'+props.item._id")
      v-flex(d-flex sm3 md3 slot="actions" slot-scope="props")
        v-layout( align-center
          :column="!$vuetify.breakpoint.mdAndDown", 
          :justify-center="!$vuetify.breakpoint.mdAndDown", 
          :justify-space-between="$vuetify.breakpoint.mdAndDown")
          div.px-3(class="custom-product-card-price")
            PriceProvider(:value="props.item.literals.price")
          v-btn(color="primary" @click="_handleCartAdd(props.item._id)", :disabled="_isAlreadyInCart(props.item._id)", :loading="productsOnAwait[props.item._id]")
            div(v-if="!_isAlreadyInCart(props.item._id)") Купить
            div(v-else) В корзине
  div.text-xs-center.pt-2
    v-pagination(v-model="pagination.page", :length="pages")
</template>

<script>
import ProductCardFull from '@/views-partials/ProductCardFull'
import { ACTIONS as USER_ACTIONS } from '@/store/UserStore'
import { ACTIONS as SHOP_ACTIONS } from '@/store/ShopStore'
import PriceProvider from '@/views-partials/PriceProvider'
import OnlyForAuthorized from '@/views-partials/feedback/OnlyForAuthorized'

export default {
  components: {
    ProductCardFull,
    PriceProvider,
    OnlyForAuthorized,
  },
  props: {
    filters: {type:Object}
  },
  data: () => ({
    pagination: {},
    productsOnAwait: {},
  }),
  methods: {
    _handleCartAdd(product_id) {
      if(!this.$store.getters['user/ifAuthorized']) return this.$refs.onlyForAuthSnack.show()
      this.$set(this.productsOnAwait, product_id, true)
      this.$store.dispatch(`user/cart/${USER_ACTIONS.CART.ADD}`, {
        id: product_id,
        amount: 1
      }).then(status => {
        this.$set(this.productsOnAwait, product_id, false)
      })
    },
    _isAlreadyInCart(product_id) { return this.$store.getters['user/cart/isAlreadyContain'](product_id) },
  },
  computed: {
    pages() {
      if (this.pagination.rowsPerPage == null || this.pagination.totalItems == null) return 0
      return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
    },
  }
}
</script>

<style lang="sass">

</style>


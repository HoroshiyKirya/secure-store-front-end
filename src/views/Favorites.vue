<template lang="pug">
v-container
  v-layout(justify-center v-if="!_isDataLoaded"): v-progress-circular.mt-5(indeterminate color="primary" size="48")
  v-layout(column v-else)
    v-card.mb-2
      v-data-iterator(content-tag="v-layout" column :items="_mapProductsForList")
        v-layout(column slot="item" slot-scope="propsCard")
          ProductCardFull(:data="propsCard.item", :to="'/product/'+propsCard.item._id" flat)
            v-flex(d-flex sm3 md3 slot="actions" slot-scope="props")
              v-layout(align-center
                :column="!$vuetify.breakpoint.mdAndDown", 
                :justify-center="!$vuetify.breakpoint.mdAndDown", 
                :justify-space-between="$vuetify.breakpoint.mdAndDown") 
                div.px-3(class="custom-product-card-price")
                  PriceProvider(:value="props.item.literals.price")
                v-btn(color="primary" @click="_handleCartAdd(props.item._id)", :loading="productsOnAwait[props.item._id]", :disabled="_isAlreadyInCart(props.item._id)")
                  div(v-if="!_isAlreadyInCart(props.item._id)") Купить
                  div(v-else) В корзине
                v-btn(color="primary" flat @click="_handleRemoveProduct(props.item._id)", :loading="productsOnAwait[props.item._id]") Удалить
          v-divider
</template>

<script>
import ProductCardFull from '@/views-partials/ProductCardFull'
import PriceProvider from '@/views-partials/PriceProvider'
import { ACTIONS as USER_ACTIONS } from '@/store/UserStore'
import { ACTIONS as SHOP_ACTIONS } from '@/store/ShopStore'

export default {
  components: {
    ProductCardFull,
    PriceProvider,
  },
  data: () => ({
    productsOnAwait: {}
  }),
  methods: {
    _handleRemoveProduct(product_id) {
      this.$set(this.productsOnAwait, product_id, true)
      this.$store.dispatch(`user/favs/${USER_ACTIONS.FAVS.REMOVE}`, product_id).then(status => {
        this.$set(this.productsOnAwait, product_id, false)
      })
    },
    _handleCartAdd(product_id) {
      this.$set(this.productsOnAwait, product_id, true)
      this.$store.dispatch(`user/cart/${USER_ACTIONS.CART.ADD}`, {
        id: product_id, amount: 1
      }).then(status => {
        this.$set(this.productsOnAwait, product_id, false)
      })
    },
    _isAlreadyInCart(product_id) { return this.$store.getters['user/cart/isAlreadyContain'](product_id) },
  },
  computed: {
    _isDataLoaded() { return this.$store.state.user.favsProducts !== null },
    _mapProductsForList() {
      return this.$store.state.user.favsProducts.products
    }
  },
}
</script>

<style lang="sass">

</style>


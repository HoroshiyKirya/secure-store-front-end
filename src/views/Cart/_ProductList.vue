<template lang="pug">
v-card.mb-2
  v-data-iterator(content-tag="v-layout" column :items="data")
    v-layout(column slot="item" slot-scope="propsCard")
      ProductCardFull( :data="propsCard.item.data", :to="'/product/'+propsCard.item.data._id" flat)
        v-flex(d-flex sm3 md3 slot="actions" slot-scope="props")
          v-layout(align-center
            :column="!$vuetify.breakpoint.mdAndDown", 
            :justify-center="!$vuetify.breakpoint.mdAndDown", 
            :justify-space-between="$vuetify.breakpoint.mdAndDown")
            div.px-3.custom-product-card-price(v-if="props.item.accounting.inStock > 0")
              PriceProvider(:value="props.item.literals.price * propsCard.item.amount")
            div(v-if="props.item.accounting.inStock > 0")
              div.orange--text.caption.text-xs-center(v-if="propsCard.item.amount > props.item.accounting.inStock") В наличии только {{props.item.accounting.inStock}}
              v-btn(flat icon @click="_handleCartAdd(props.item._id, propsCard.item.amount - 1)", :loading="productsOnAwait[props.item._id]"): v-icon mdi-minus
              span.grey--text ({{propsCard.item.amount}})
              v-btn(flat icon @click="_handleCartAdd(props.item._id, propsCard.item.amount + 1)", :loading="productsOnAwait[props.item._id]"): v-icon mdi-plus
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
  props: {
    data: {type: Array}
  },
  data: () => ({
    productsOnAwait: {}
  }),
  methods: {
    _handleRemoveProduct(product_id) {
     this.$set(this.productsOnAwait, product_id, true)
      this.$store.dispatch(`user/cart/${USER_ACTIONS.CART.REMOVE}`, product_id).then(status => {
        this.$set(this.productsOnAwait, product_id, false)
      })
    },
    _handleCartAdd(product_id, amount) {
      if(amount < 1) return
      this.$set(this.productsOnAwait, product_id, true)
      this.$store.dispatch(`user/cart/${USER_ACTIONS.CART.ADD}`, {
        id: product_id, amount
      }).then(status => {
        this.$set(this.productsOnAwait, product_id, false)
      })
    },
  },
}
</script>

<style lang="sass">

</style>


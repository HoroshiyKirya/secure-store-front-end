<template lang="pug">
v-container
  v-layout(justify-center v-if="!_isDataLoaded"): v-progress-circular.mt-5(indeterminate color="primary" size="48")
  v-layout(column v-else-if="$store.state.user.cartProducts.list.length > 0")
    Cart_ProductList(:data="_mapProductsForList")
    Cart_DeliverForm(:products="_mapProductsForList")
  v-layout(v-else justify-center)
    div.ma-5 empty
</template>

<script>
import { ACTIONS as USER_ACTIONS } from '@/store/UserStore'

import Cart_DeliverForm from './_DeliverForm'
import Cart_ProductList from './_ProductList'

export default {
  components: {
    Cart_DeliverForm,
    Cart_ProductList,
  },
  data: () => ({}),
  methods: {},
  computed: {
    _isDataLoaded() { return this.$store.state.user.cartProducts !== null },
    _mapProductsForList() {
      return this.$store.state.user.cartProducts.products.map((e,i) => ({
        data: e,
        amount: this.$store.state.user.cartProducts.list.find(x=>x.productId==e._id).amount
      }))
    }
  },
}
</script>

<style lang="sass">

</style>


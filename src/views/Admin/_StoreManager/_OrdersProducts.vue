<template lang="pug">
v-container()
  v-layout(justify-center v-if="!_ordersIsLoaded"): v-progress-circular.mt-5(indeterminate color="primary" size="48")
  v-card.mb-2(v-else)
    OrdersIterator(:orders="orders")
      div(slot="extra-header-slotx" slot-scope="asd")
</template>

<script>
import ProductCardFull from '@/views-partials/ProductCardFull'
import PriceProvider from '@/views-partials/PriceProvider'
import DateTimeProvider from '@/views-partials/DateTimeProvider'
import OrdersIterator from '@/views-partials/OrdersIterator'
import { ACTIONS as USER_ACTIONS } from '@/store/UserStore'
import { ACTIONS as SHOP_ACTIONS } from '@/store/ShopStore'
import api from '@/api'

export default {
  components: {
    ProductCardFull,
    PriceProvider,
    DateTimeProvider,
    OrdersIterator,
  },
  props: {},
  data: () => ({
    orders: null,
  }),
  methods: {},
  computed: {
    _ordersIsLoaded(){ return this.orders != null }
  },
  mounted() {
    api.v1.kernel.shop.orders.products().then(response => {
      this.orders = response.data.orders
    })
  }
}
</script>

<style lang="sass">

</style>


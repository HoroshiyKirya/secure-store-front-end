<template lang="pug">
v-container()
  v-layout(justify-center v-if="!_ordersIsLoaded"): v-progress-circular.mt-5(indeterminate color="primary" size="48")
  v-card.mb-2(v-else)
    v-data-iterator(content-tag="v-layout" column, :items="[...orders].reverse()")
      v-layout(column slot="item" slot-scope="props" justify-space-between)
        v-layout.py-2.px-3(justify-space-between)
          v-layout(:align-center="$vuetify.breakpoint.mdAndUp", :column="$vuetify.breakpoint.smAndDown")
            v-icon.mr-3.hidden-sm-and-down mdi-phone
            a.black--text.mr-3(:href="`tel:${props.item.phone}`") {{props.item.phone}}
            strong(style="text-transform:uppercase") {{props.item.name}}
          DateTimeProvider.grey--text(:value="props.item.date")
        v-divider
</template>

<script>
import ProductCardFull from '@/views-partials/ProductCardFull'
import PriceProvider from '@/views-partials/PriceProvider'
import DateTimeProvider from '@/views-partials/DateTimeProvider'
import api from '@/api'

export default {
  components: {
    ProductCardFull,
    PriceProvider,
    DateTimeProvider,
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
    api.v1.kernel.shop.orders.calls().then(response => {
      console.log('calls', response)
      this.orders = response.data.orders
    })
  }
}
</script>

<style lang="sass">

</style>


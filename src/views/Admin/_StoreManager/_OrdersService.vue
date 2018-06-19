<template lang="pug">
v-container()
  v-layout(justify-center v-if="!_ordersIsLoaded"): v-progress-circular.mt-5(indeterminate color="primary" size="48")
  v-card.mb-2(v-else)
    OrdersIterator(:orders="orders.map(e=>e.orderData)" headerless)
      div(slot="extra-header-slotx-big" slot-scope="props")
        v-layout(:column="$vuetify.breakpoint.smAndDown" justify-space-between )
          div Услуга: 
            strong {{$store.getters['shop/serviceByServiceName'](orders.find(e=>e.data.forOrder==props.item.data._id).data.service).title}}
          div Тип: 
            strong {{$store.getters['shop/serviceByServiceName'](orders.find(e=>e.data.forOrder==props.item.data._id).data.service).types.find(e=>e._id==orders.find(e=>e.data.forOrder==props.item.data._id).data.type).type}}
        v-layout(:column="$vuetify.breakpoint.smAndDown" justify-space-between )
          div Для заказа: 
            strong {{orders.find(e=>e.data.forOrder==props.item.data._id).data.forOrder}}
          DateTimeProvider(:value="orders.find(e=>e.data.forOrder==props.item.data._id).data.date")
</template>

<script>
import ProductCardFull from '@/views-partials/ProductCardFull'
import PriceProvider from '@/views-partials/PriceProvider'
import DateTimeProvider from '@/views-partials/DateTimeProvider'
import OrdersIterator from '@/views-partials/OrdersIterator'
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
  methods: {
    _test(e) { console.log(e)}
  },
  computed: {
    _ordersIsLoaded(){ return this.orders != null }
  },
  mounted() {
    api.v1.kernel.shop.orders.service().then(response => {
      this.orders = response.data.orders
      console.log('orders, wad', response.data.orders, this.orders.map(e=>e.orderData))
    })
  }
}
</script>

<style lang="sass">

</style>


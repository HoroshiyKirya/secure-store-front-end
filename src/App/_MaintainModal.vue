<template lang="pug">
v-dialog(v-model="isShown", lazy
  :transition="$vuetify.breakpoint.smAndDown?'dialog-bottom-transition':'dialog-transition'", 
  :fullscreen="$vuetify.breakpoint.smAndDown"
  hide-overlay
  width="400")
  v-card()
    v-alert(type="success" v-model="done" style="margin:0") Успешно
    v-btn.hidden-md-and-up(flat @click="toggle" fab fixed right top): v-icon mdi-close
    div(style="height:20px")
    v-form.pa-4(ref="maintainForm" v-model="isValid" lazy-validation)
      div.headline ЗАКАЗАЗ ОБСЛУЖИВАНИЯ
      v-layout(justify-center v-if="!_ordersIsLoaded"): v-progress-circular.mt-5(indeterminate color="primary" size="48")
      v-layout(justify-center v-else-if="orders.length === 0") У вас нет заказов
      v-layout(column v-else)
        h4.subheader Выберите заказ
        v-select.mt-3(v-model="dfOrderId" solo
          :items="orders"
          :rules="[inputAssertRules.notEmpty]"
          item-text="_id" item-value="_id")
        v-select.mt-3(v-model="dfMaintainType" solo
          :items="$store.getters['shop/serviceByServiceName']('maintain').types"
          :rules="[inputAssertRules.notEmpty]"
          item-text="type" item-value="_id")
        v-text-field(label="Телефон" box
          v-model="dfPhone"
          :rules="[inputAssertRules.notEmpty]")
        div.mt-2 {{_totalPrice}} руб.
        div.pa-3
          v-btn(color="primary", :block="true" large @click="_submitOrder", :loading="onOrderSubmitAwait", :disabled="done") Заказать
</template>

<script>
import inputAssertRules from '@/views-utils/inputAssertRules'
import { ACTIONS as SHOP_ACTIONS } from '@/store/ShopStore'
import api from '@/api'

export default {
  components: {},
  data: () => ({
    inputAssertRules,
    orders: null,
    isShown: false,
    isValid: false,
    dfPhone: '',
    onOrderSubmitAwait: false,
    done: false,
    dfOrderId: null,
    dfMaintainType: null,
  }),
  props: { },
  methods: {
    toggle() { this.isShown = !this.isShown },
    _submitOrder() {
      let canAdd = true
      canAdd = canAdd & this.$refs.maintainForm.validate()
      if(canAdd) {
        this.onOrderSubmitAwait = true
        this.$store.dispatch(`shop/orders/${SHOP_ACTIONS.ORDERS.MAKE_SERVICE_ORDER}`, {
          service: 'maintain',
          forOrder: this.dfOrderId,
          type: this.dfMaintainType,
          phone: this.dfPhone,
        }).then(status => {
          this.onOrderSubmitAwait = false
          this.done = true
        })
      }
    }
  },
  computed: {
    _ordersIsLoaded(){ return this.orders != null },
    _totalPrice() {
      if(this.dfOrderId && this.dfMaintainType) {
        console.log('x', this.orders.find(e=>e._id==this.dfOrderId), this.dfOrderId)
        const maintainTypeMultiplier = this.$store.getters['shop/serviceByServiceName']('maintain').types.find(e=>e._id==this.dfMaintainType).multiplier
        const order = this.orders.find(e=>e._id==this.dfOrderId)
        return order.productsData.reduce((acc, val) => {
          return acc + (parseInt(val.literals.price_maintain) * maintainTypeMultiplier) * order.data.products.find(e=>e.productId==val._id).amount
        }, 0)
      }
      else return 0
    },
  },
  mounted() {
    api.v1.shop.orders.get().then(response => {
      this.orders = response.data.orders
    })
  }
}
</script>

<style lang="sass" scoped>

</style>


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
    v-form.pa-4(ref="diagnosticsForm" v-model="isValid" lazy-validation)
      div.headline ЗАКАЗАЗ ДИАГНОСТИКИ
      v-layout(justify-center v-if="!_ordersIsLoaded"): v-progress-circular.mt-5(indeterminate color="primary" size="48")
      v-layout(justify-center v-else-if="orders.length === 0") У вас нет заказов
      v-layout(column v-else)
        h4.subheader Выберите заказ
        v-select.mt-3(v-model="dfOrderId" solo
          :items="orders"
          :rules="[inputAssertRules.notEmpty]"
          item-text="_id" item-value="_id")
        v-select.mt-3(v-model="dfDiagnosticType" solo
          :items="$store.getters['shop/serviceByServiceName']('diagnostic').types"
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
    dfDiagnosticType: null,
  }),
  props: { },
  methods: {
    toggle() { this.isShown = !this.isShown },
    _submitOrder() {
      let canAdd = true
      canAdd = canAdd & this.$refs.diagnosticsForm.validate()
      if(canAdd) {
        this.onOrderSubmitAwait = true
        this.$store.dispatch(`shop/orders/${SHOP_ACTIONS.ORDERS.MAKE_SERVICE_ORDER}`, {
          service: 'diagnostic',
          forOrder: this.dfOrderId,
          type: this.dfDiagnosticType,
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
      if(this.dfOrderId && this.dfDiagnosticType) {
        console.log('x', this.orders.find(e=>e._id==this.dfOrderId), this.dfOrderId)
        const diagnosticTypeMultiplier = this.$store.getters['shop/serviceByServiceName']('diagnostic').types.find(e=>e._id==this.dfDiagnosticType).multiplier
        const order = this.orders.find(e=>e._id==this.dfOrderId)
        return order.productsData.reduce((acc, val) => {
          return acc + (parseInt(val.literals.price_diagnosis) * diagnosticTypeMultiplier) * order.data.products.find(e=>e.productId==val._id).amount
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


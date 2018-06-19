<template lang="pug">
v-card.grey.lighten-3.custom-deliver-form
    v-layout(row wrap)
      v-flex.pa-3(xs12 sm6)
        div.headline ПОЛУЧАТЕЛЬ
        v-form(ref="deliverFormRecipient" v-model="isValid" lazy-validation)
          h4.subheader.custom-deliver-form-subheader Укажите Ваши контактные данные
          v-text-field(label="Имя" box
            v-model="dfName"
            :rules="[inputAssertRules.notEmpty]")
          v-text-field(label="Email" box
            v-model="dfEmail"
            :rules="[inputAssertRules.notEmpty,inputAssertRules.email]")
          v-text-field(label="Телефон" box
            v-model="dfPhone"
            :rules="[inputAssertRules.notEmpty]")
          v-text-field(label="Адрес доставки" box
            v-model="dfAddress"
            :rules="[inputAssertRules.notEmpty]")
      v-flex.pa-3(xs12 sm6)
        div.headline ДОСТАВКА
        v-form(ref="deliverFormDeliver" v-model="isValid" lazy-validation)
          h4.subheader.custom-deliver-form-subheader Выберите способ доставки
          v-radio-group(v-model="deliverType", :rules="[inputAssertRules.notEmpty]")
            v-radio(v-for="(dt, i) in $store.getters['shop/serviceByServiceName']('delivery').types",:key="dt._id", :label="dt.title", :value="dt._id")
          v-text-field(box textarea label="Комментарий к заказу ( необязательно )" v-model="dfComment")
          v-checkbox(label="Я даю согласие на обработку персональных данных" v-model="isAgreeTerms", :rules="[_asserAgreeTerm]")
      v-flex.mb-3(xs12)
        v-card.pa-3.grey.lighten-5(:flat="!isMountEnabled")
          v-layout(row)
            div.headline МОНТАЖ
            v-switch.custom-deliver-form-form-toggle(v-model="isMountEnabled" hide-details)
          v-form(ref="deliverFormMount" v-model="isValid" lazy-validation)
            h4.subheader.custom-deliver-form-subheader 
              | Выберите необходимый тип объекта и желаемый уровень оборудования. 
            v-select.mt-3(v-model="dfMountType"
              :items="$store.getters['shop/serviceByServiceName']('mount').types"
              :disabled="!isMountEnabled"
              :rules="[inputAssertRules.notEmpty]"
              item-text="target" item-value="_id")
      v-flex(xs12).px-3.pb-3
        v-layout(:column="$vuetify.breakpoint.smAndDown" align-center justify-space-between)
          PriceProvider.custom-deliver-form-price(:value="_totalPrice")
          v-btn(color="primary", :block="$vuetify.breakpoint.smAndDown" large @click="_submitOrder", :loading="onOrderSubmitAwait") Оформить
        v-layout(column).caption
          div.mb-1 Цена товара: 
            PriceProvider.caption(:value="_totalPricePrice")
          div.mb-1(v-if="isMountEnabled && dfMountType") Монтаж:
            PriceProvider.caption(:value="_totalPriceMount")
          div.mb-1(v-if="deliverType") Доставка:
            PriceProvider.caption(:value="_priceDelivery")
</template>

<script>
import PriceProvider from '@/views-partials/PriceProvider'
import inputAssertRules from '@/views-utils/inputAssertRules'
import { ACTIONS as SHOP_ACTIONS } from '@/store/ShopStore'
import router from '@/router'
export default {
  components: {
    PriceProvider
  },
  props: {
    products: { type: Array }
  },
  data: () => ({
    isValid: false,
    inputAssertRules,
    deliverType : null,
    isAgreeTerms: false,
    isMountEnabled: false,
    dfMountType: null,
    dfName: null,
    dfEmail: null,
    dfPhone: null,
    dfAddress: null,
    dfComment: null,
    onOrderSubmitAwait: false
  }),
  methods: {
    _asserAgreeTerm(e) {
      return e !== false ? true : 'Должны принять условия'
    },
    _submitOrder() {
      let canAdd = true
      canAdd = canAdd & this.$refs.deliverFormRecipient.validate()
      canAdd = canAdd & this.$refs.deliverFormDeliver.validate()
      if(this.isMountEnabled) canAdd = canAdd & this.$refs.deliverFormMount.validate()
      if(canAdd) {
        this.onOrderSubmitAwait = true
        this.$store.dispatch(`shop/orders/${SHOP_ACTIONS.ORDERS.MAKE_PRODUCT_ORDER}`, {
          recipient: {
            name: this.dfName,
            email: this. dfEmail,
            phone: this.dfPhone,
            address: this.dfAddress,
          },
          delivery: {
            type: this.deliverType,
            comment: this.dfComment,
          },
          mount: this.isMountEnabled ? {type:this.dfMountType} : false,
        }).then(status => {
          router.push({ path: '/orders', query: {order:status.order._id} })
          // this.onOrderSubmitAwait = false
          // this.$refs.deliverFormRecipient.reset()
          // this.$refs.deliverFormDeliver.reset()
          // this.$refs.deliverFormMount.reset()
        })
      }
    }
  },
  computed: {
    _priceDelivery() {
      if(this.deliverType) return this.$store.getters['shop/serviceByServiceName']('delivery').types.find(e=>e._id==this.deliverType).price
      else return 0
    },
    _totalPricePrice() {
      return this.products.reduce((acc, val) => acc + parseInt(val.data.literals.price) * (val.amount > val.data.accounting.inStock ? val.data.accounting.inStock : val.amount), 0)
    },
    _totalPriceMount() {
      if((this.isMountEnabled && this.dfMountType)) {
        const mountTypeMultiplier = this.$store.getters['shop/serviceByServiceName']('mount').types.find(e=>e._id==this.dfMountType).multiplier
        return this.products.reduce((acc, val) => {
          return acc + (parseInt(val.data.literals.price_mount) * mountTypeMultiplier) * (val.amount > val.data.accounting.inStock ? val.data.accounting.inStock : val.amount)
        }, 0)
      }
      else return 0
    },
    _totalPrice() {
      return this._totalPricePrice + this._totalPriceMount
    }
  }
}
</script>

<style lang="sass">
.custom-deliver-form
  &-price
    text-align: center
    font-weight: 900
    font-size: 26px
  &-subheader
    height: initial
    font-weight: 500
    margin-top: 24px
  &-form-toggle
    justify-content: flex-end !important
    .input-group__input
      width: initial !important
      flex-grow: 0 !important
      flex-basis: auto !important
    
</style>


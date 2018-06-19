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
    v-form.pa-4(ref="callForm" v-model="isValid" lazy-validation)
      div.headline ЗАКАЗАТЬ ЗВОНОК
      h4.subheader.custom-deliver-form-subheader Укажите Ваши контактные данные, и мы Вам обязательно перезвоним
      v-text-field(label="Имя" box
        v-model="cfName"
        :rules="[inputAssertRules.notEmpty]")
      v-text-field(label="Телефон" box
        v-model="cfPhone"
        :rules="[inputAssertRules.notEmpty]")
      div.px-3.pb-3
        v-btn(color="primary", :block="true" large @click="_submitOrder", :loading="onOrderSubmitAwait", :disabled="done") Заказать
</template>

<script>
import inputAssertRules from '@/views-utils/inputAssertRules'
import { ACTIONS as SHOP_ACTIONS } from '@/store/ShopStore'
export default {
  components: {},
  data: () => ({
    inputAssertRules,
    isShown: false,
    isValid: false,
    cfName: '',
    cfPhone: '',
    onOrderSubmitAwait: false,
    done: false
  }),
  props: { },
  methods: {
    toggle() { this.isShown = !this.isShown },
    _submitOrder() {
      let canAdd = true
      canAdd = canAdd & this.$refs.callForm.validate()
      if(canAdd) {
        this.onOrderSubmitAwait = true
        this.$store.dispatch(`shop/orders/${SHOP_ACTIONS.ORDERS.MAKE_CALL_ORDER}`, {
          name: this.cfName,
          phone: this.cfPhone,
        }).then(status => {
          this.onOrderSubmitAwait = false
          this.done = true
        })
      }
    }
  },
  computed: {

  }
}
</script>

<style lang="sass" scoped>

</style>


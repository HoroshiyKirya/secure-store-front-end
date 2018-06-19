<template lang="pug">
v-layout(column align-center)
  Form
    v-flex(sm12)
      FormGroup
        FormTitle Учет
        v-select.mt-2(:items="$store.state.shop.map" v-model="category" label="Категория" item-text="title" item-value="_id" solo return-object @change="subcategoryId=null")
        v-select.mt-2(:items="category?category.subcategories:[]" v-model="subcategoryId" label="Подкатегория" item-text="title" item-value="_id" solo, :disabled="!category" @change="_onSubcategoryChange")
        
  v-layout.mt-3(align-center column v-if="subcategoryId")
    v-progress-circular.ma-3(indeterminate color="primary" v-if="isProductsLoadAwait")
    v-flex(v-else)
      v-data-iterator(content-tag="v-layout" column :items="localProductCopy")
        v-card.ma-1.grey.lighten-3(slot="item" slot-scope="props", )
          v-layout
            v-layout(align-center justify-center).white(style="width:87px;height:87px;").pa-2
              img(:src='`http://localhost:3000/uploads/products/${props.item.image}`' style="max-width:100%;max-height:100%")
            v-layout.pa-2(column)
              strong {{props.item.title}}
              v-layout.mt-1(justify-space-between)
                v-btn(flat small icon @click="_handleProductAmount(props.item, -1)", :disabled="awaitModels[props.index]"): v-icon mdi-minus
                v-btn(flat small icon @click="_handleProductAmount(props.item, 1)", :disabled="awaitModels[props.index]"): v-icon mdi-plus
                v-text-field(solo flat type="number", :value="props.item.accounting.inStock" @change="e => _handleProductAmountChange(props.item, e)", :disabled="awaitModels[props.index]") 
                v-btn(flat small icon @click="_handleProductAmountApply(props.item, props.index)", :loading="awaitModels[props.index]"): v-icon mdi-check
</template>

<script>
import inputAssertRules from '@/views-utils/inputAssertRules'
import { ACTIONS as KERNEL_ACTIONS } from '@/store/KernelStore'
import { ACTIONS as SHOP_ACTIONS } from '@/store/ShopStore'
import { Form, FormGroup, FormTitle, FormSubtitle } from '@/views-partials/Form'
export default {
  components: {
    Form, 
    FormGroup,
    FormTitle,
    FormSubtitle,
  },
  data: () => ({
    inputAssertRules,
    category: null,
    subcategoryId: null,
    isProductsLoadAwait: false,
    localProductCopy: null,
    awaitModels: []
  }),
  methods: {
    _onSubcategoryChange(e) {
      console.log(this.subcategoryId)
      this.isProductsLoadAwait = true
      this.$store.dispatch(`kernel/accounting/${KERNEL_ACTIONS.ACCOUNTING.LOAD_PRODUCTS_FOR_SUBCATEGORY_ALL}`, e).then(e => {
        this.isProductsLoadAwait = false
        this.localProductCopy = [ ...this.$store.state.kernel.accounting.productsForSubcategoryAll ]
      })
    },
    _handleProductAmount(item, delta) {
      if((parseInt(item.accounting.inStock) + delta) < 0) return 
      item.accounting.inStock = parseInt(item.accounting.inStock) + delta
    },
    _handleProductAmountChange(item, newValue) {
      let val = parseInt(newValue)
      if(isNaN(val)) return
      if(val < 0) return
      item.accounting.inStock = parseInt(newValue)
    },
    _handleProductAmountApply(item, index) {
      this.$set(this.awaitModels, index, true)
      this.$store.dispatch(`kernel/accounting/${KERNEL_ACTIONS.ACCOUNTING.CHANGE_PRODUCT_AMOUNT}`, {id: item._id, amount: item.accounting.inStock})
      .then(status => {
        this.$set(this.awaitModels, index, false)
      })
    }
  },
  computed: {
  }
}
</script>

<style lang="sass">

</style>


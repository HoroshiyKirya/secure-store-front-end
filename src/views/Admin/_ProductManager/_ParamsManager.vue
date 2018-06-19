<template lang="pug">
v-layout(column align-center)
  Form
    v-flex(sm12)
      FormGroup
        FormTitle Добавить характеристику
        v-select.mt-2(:items="[{value:'global',text:'Глобальная'},{value:'primary',text:'Локальная первичная'},{value:'secondary',text:'Локальная вторичная'}]" v-model="paramType" label="тип" solo)
        v-select.mt-2(v-if="paramType!=='global'",:items="$store.state.shop.map" v-model="category" label="Категория" item-text="title" item-value="_id" solo return-object @change="subcategoryId=null")
        v-select.mt-2(v-if="paramType!=='global'",:items="category?category.subcategories:[]" v-model="subcategoryId" label="Подкатегория" item-text="title" item-value="_id" solo, :disabled="!category" )
        v-text-field(label="Название" box hide-details v-model="paramTitle", :rules="[inputAssertRules.notEmpty]")
        v-select(:items="[{value:'string'},{value:'number'}]" v-model="paramValueType" label="тип" solo item-text="value" )
        v-text-field(v-if="paramType==='global'" label="поле" box hide-details v-model="fieldName", :rules="[inputAssertRules.notEmpty]")
        v-checkbox.mt-4(label="включить в фильтрацию" v-model="isFilterable")
        v-btn.ma-0.mt-2(color="primary" @click="_handleAddPrimary", :loading="isAddAwait", :disabled="!canAdd") Добавить
  v-layout.mt-3 list
</template>

<script>
import inputAssertRules from '@/views-utils/inputAssertRules'
import { slugify } from 'transliteration'
import { ACTIONS as KERNEL_ACTIONS } from '@/store/KernelStore'
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
    paramType: 'primary',
    paramTitle: '',
    paramValueType: 'string',
    isFilterable: true,
    category: null,
    subcategoryId: null,
    isAddAwait: false,
    fieldName: ''
  }),
  methods: {
    _handleAddPrimary() {
      this.isAddAwait = true
      this.$store.dispatch(`kernel/products/${KERNEL_ACTIONS.PARAM_ADD}`, {
        type: this.paramType,
        title: this.paramTitle,
        valueType: this.paramValueType,
        forSubcategory: this.subcategoryId,
        field: this.fieldName,
        filterable: this.isFilterable
      }).then(e => {
        this.isAddAwait = false
        this.paramTitle = ''
      })
    },
  },
  computed: {
    canAdd() {
      if(this.paramType === 'global') {
        if((this.paramTitle.trim()==='')||(this.fieldName.trim()==='')) return false
        else return true
      }
      if((this.paramTitle!=='')&&(this.subcategoryId!==null)) return true
      return false
    },
  }
}
</script>

<style lang="sass">

</style>


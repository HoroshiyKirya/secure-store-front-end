<template lang="pug">
v-layout(column align-center)
  v-layout(align-center column v-if="isParamMapLoadAwait")
    v-progress-circular.ma-3(indeterminate color="primary")
  Form(v-else)
    v-flex(sm12)
      FormGroup
        FormTitle Добавить товар
        v-select.mt-2(solo return-object
            :items="$store.state.shop.map"
            v-model="category"
            label="Категория"
            item-text="title"
            item-value="_id"
            @change="subcategoryId=null")
        v-select.mt-2(solo
            :items="category?category.subcategories:[]"
            v-model="subcategoryId"
            label="Подкатегория"
            item-text="title"
            item-value="_id"
            :disabled="!category"
            @change="paramsModels={}")
        v-text-field(label="Название" box hide-details v-model="title", :rules="[inputAssertRules.notEmpty]")
        FileInput(label="Изображение" v-model="image")
        template(v-if="subcategoryId")
          FormSubtitle глобальные характеристики (обязательно)
          v-text-field.mt-0(hide-details 
            :rules="[inputAssertRules.notEmpty]"
            v-model="paramsModels[gp._id]"
            :type="gp.valueType==='number'?'number':'text'"
            v-for="gp in $store.state.shop.paramsMap.global"
            :key="gp._id"
            :label="`${gp.title}(${gp.valueType})`")
        template(v-if="subcategoryId")
          FormSubtitle локальные характеристики основные (обязательно)
          v-text-field.mt-0(hide-details 
            :rules="[inputAssertRules.notEmpty]"
            v-model="paramsModels[lp._id]"
            :type="lp.valueType==='number'?'number':'text'"
            v-for="lp in $store.state.shop.paramsMap.local.find(e=>e._id===subcategoryId).params.filter(e=>e.type==='primary')"
            :key="lp._id"
            :label="`${lp.title}(${lp.valueType})`")
        template(v-if="subcategoryId")
          FormSubtitle локальные характеристики вторичные
          v-text-field.mt-0(hide-details 
            v-model="paramsModels[lp._id]"
            :type="lp.valueType==='number'?'number':'text'"
            v-for="lp in $store.state.shop.paramsMap.local.find(e=>e._id===subcategoryId).params.filter(e=>e.type==='secondary')"
            :key="lp._id"
            :label="`${lp.title}(${lp.valueType})`")
        v-btn.ma-0.mt-2(color="primary" @click="_handleAdd", :loading="isAddAwait", :disabled="!canAdd") Добавить
</template>

<script>
import inputAssertRules from '@/views-utils/inputAssertRules'
import FileInput from '@/components/FileInput'
import { slugify } from 'transliteration'
import { ACTIONS as KERNEL_ACTIONS } from '@/store/KernelStore'
import { Form, FormGroup, FormTitle, FormSubtitle } from '@/views-partials/Form'
export default {
  components: { Form,FormGroup,FormTitle,FormSubtitle,FileInput },
  data: () => ({
    inputAssertRules,
    isParamMapLoadAwait: false,
    category: null,
    subcategoryId: null,
    title: '',
    isAddAwait: false,
    paramsModels: {},
    image: null,
  }),
  methods: {
    _handleAdd() {
      this.isAddAwait = true
      this.$store.dispatch(`kernel/products/${KERNEL_ACTIONS.PRODUCTS.ADD}`, {
        title: this.title,
        image: this.image[0],
        params: Object.keys(this.paramsModels).map(e => ({ paramId:e,value:this.paramsModels[e] })),
        fromSubcategory: this.subcategoryId
      }).then(e => {
        this.isAddAwait = false
        this.title = ''
      })
    },
  },
  computed: {
    canAdd() {
      if(this.subcategoryId===null) return

      let allRequiredParams = []
      allRequiredParams = allRequiredParams.concat(this.$store.state.shop.paramsMap.global.map(e=>e._id))
      allRequiredParams = allRequiredParams.concat(this.$store.state.shop.paramsMap.local.find(e=>e._id===this.subcategoryId).params.filter(e=>e.type==='primary').map(e=>e._id))
      let allRequiredParamsNotEmpty = allRequiredParams.reduce((val, e) => {
        if(this.paramsModels[e]===undefined) return false
        if(this.paramsModels[e].toString().trim().length>0) return true
        return false
      },true)
      if(!allRequiredParamsNotEmpty) return false

      const isRequiredModelsNotEmpty = allRequiredParams.reduce((val, e) => (this.paramsModels[e].toString().trim().length!==0)&&val, true)
      if(!isRequiredModelsNotEmpty) return false

      if(this.title.trim()==='') return false
      if(this.image === null) return false
      if(this.image.length===0) return false
      return true
    },
  },
  mounted() {}
}
</script>

<style lang="sass">

</style>


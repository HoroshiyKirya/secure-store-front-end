<template lang="pug">
v-layout(column align-center)
  Form(double)
    v-flex(xs12 sm6)
      FormGroup
        FormTitle Добавить категорию
        v-text-field(label="Название" box hide-details v-model="categoryTF", :rules="[inputAssertRules.notEmpty]")
        v-text-field(:value="slugifyCategoryTF" label="slugify" disabled placeholder=" " hide-details)
        v-btn.ma-0.mt-2(color="primary" @click="_handleAddCategory", :loading="isAddCategoryAwait", :disabled="!canAddCategory") Добавить
    v-flex(xs12 sm6)
      FormGroup
        FormTitle Добавить подкатегорию
        v-text-field(label="Название" box hide-details v-model="subcategoryTF", :rules="[inputAssertRules.notEmpty]")
        v-select(:items="$store.state.shop.map" v-model="subcategoryParentId" label="Для категории" autocomplete item-text="title" item-value="_id" solo)
        v-text-field.mt-2(:value="slugifySubcategoryTF" label="slugify" disabled, :prefix="slugifySubcategoryTFPrefix" placeholder=" " hide-details)
        v-btn.ma-0.mt-2(color="primary" @click="_handleAddSubcategory", :loading="isAddSubcategoryAwait", :disabled="!canAddSubcategory") Добавить
    //-v-btn(color="primary", :block="true" large @click="" slot="actions") Вход
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
    categoryTF: '',
    subcategoryTF: '',
    subcategoryParentId: null,
    isAddCategoryAwait: false,
    isAddSubcategoryAwait: false,
  }),
  methods: {
    _handleAddCategory() {
      this.isAddCategoryAwait = true
      this.$store.dispatch(`kernel/products/${KERNEL_ACTIONS.PRODUCTS.CATEGORY_ADD}`, this.categoryTF).then(e => {
        this.isAddCategoryAwait = false
        this.categoryTF = ''
      })
    },
   _handleAddSubcategory() {
      this.isAddSubcategoryAwait = true
      this.$store.dispatch(`kernel/products/${KERNEL_ACTIONS.PRODUCTS.SUBCATEGORY_ADD}`, { title: this.subcategoryTF, parent: this.subcategoryParentId }).then(e => {
        this.isAddSubcategoryAwait = false
        this.subcategoryTF = ''
      })
    },
  },
  computed: {
    canAddCategory() { return this.categoryTF !== '' },
    canAddSubcategory() { return (this.subcategoryTF !== '') && (this.subcategoryParentId != null) },
    slugifyCategoryTF() { return slugify(this.categoryTF) },
    slugifySubcategoryTF() { return slugify(this.subcategoryTF) },
    slugifySubcategoryTFPrefix() { return this.subcategoryParentId ? `${this.$store.state.shop.map.find(e=>e._id===this.subcategoryParentId).path}/` : '' },
  }
}
</script>

<style lang="sass">

</style>


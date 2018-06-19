<template lang="pug">
  v-layout(column)
    v-tabs(slider-color="primary" color="transparent")
      v-tab Категории
      v-tab Товары
      v-tab Характеристики
      v-tab-item 
        ProductManager_CategoryManager
      v-tab-item
        ProductManager_ProductManager
      v-tab-item 
        ProductManager_ParamsManager
</template>

<script>
import ProductManager_CategoryManager from './_CategoryManager'
import ProductManager_ParamsManager from './_ParamsManager'
import ProductManager_ProductManager from './_ProductManager'
export default {
  components: {
    ProductManager_CategoryManager,
    ProductManager_ParamsManager,
    ProductManager_ProductManager,
  }
}
</script>

<style lang="sass">

</style>


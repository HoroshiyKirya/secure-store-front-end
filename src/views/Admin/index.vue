<template lang="pug">
v-container
  v-card(color="grey lighten-4")
    v-toolbar.elevation-2(dark tabs color="primary")
      v-toolbar-title Панель управления
      v-tabs(slider-color="white" show-arrows slot="extension" dark color="transparent"  v-model="modeltabs")
        v-tab Товар
        v-tab Магазин
    v-tabs-items(v-model="modeltabs")
      v-tab-item(lazy)
        Admin_ProductManager
      v-tab-item(lazy)
        Admin_StoreManager
</template>

<script>
import Admin_StoreManager from './_StoreManager'
import Admin_ProductManager from './_ProductManager'

export default {
  components: {
    Admin_StoreManager,
    Admin_ProductManager,
  },
  data: () => ({
    modeltabs: null
  })
}
</script>

<style lang="sass">

</style>


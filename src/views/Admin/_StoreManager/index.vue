<template lang="pug">
  v-layout(column)
    v-tabs(slider-color="primary" color="transparent")
      v-tab Учет товаров
      v-tab Заказ товаров
      v-tab Заказ услуг
      v-tab Заказ звонков
      v-tab-item
        StoreManager_ProductsAccounting
      v-tab-item 
        StoreManager_OrdersProducts
      v-tab-item 
        StoreManager_OrdersService
      v-tab-item 
        StoreManager_OrdersCalls
</template>

<script>
import StoreManager_ProductsAccounting from './_ProductsAccounting'
import StoreManager_OrdersProducts from './_OrdersProducts'
import StoreManager_OrdersCalls from './_OrdersCalls'
import StoreManager_OrdersService from './_OrdersService'
export default {
  components: {
    StoreManager_ProductsAccounting,
    StoreManager_OrdersProducts,
    StoreManager_OrdersCalls,
    StoreManager_OrdersService
  },
}
</script>

<style lang="sass">

</style>


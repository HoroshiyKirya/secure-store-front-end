<template lang="pug">
v-footer(height="auto")
  v-container.pb-0
    v-layout(column)
      v-layout(row justify-center)
        v-btn(icon large)
          v-icon(size="24px") mdi-facebook-box
        v-btn(icon large)
          v-icon(size="24px") mdi-vk-box
        v-btn(icon large)
          v-icon(size="24px") mdi-instagram
        v-btn(icon large)
          v-icon(size="24px") mdi-twitter-box
        v-btn(icon large)
          v-icon(size="24px") mdi-google-plus-box
      v-layout(row wrap justify-center)
        v-flex.pa-4(v-for="(cat,i) in $store.state.shop.map", :key="cat._id" xs12 sm6 md4 lg3 xl2)
          div.d-flex.mb-3.subheading
            strong.custom-footer-category {{cat.title}}
          div.my-1(v-for="(subcat,ii) in cat.subcategories", :key="subcat._id" flat small)
            router-link.grey--text.text--darken-1(:to="'/catalog/'+cat.path+'/'+subcat.path")
              div.custom-footer-subcategory {{subcat.title}}
      v-divider      
      v-flex(xs12 py-3 text-xs-center) &copy;2018 
        strong Secure Store
</template>

<script>

//import HelloWorld from '@/components/HelloWorld.vue'
export default {
  components: {
    
  },
  data(){
    return {}
  }
}
</script>

<style lang="sass">
.custom-footer
  &-category
    &:first-letter
      text-transform: capitalize
  &-subcategory
    &:first-letter
      text-transform: capitalize
    &:hover
      color: #e01a4f !important
</style>


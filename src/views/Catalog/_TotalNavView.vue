<template lang="pug">
  v-container
    v-layout(column)
      v-layout(row wrap justify-center)
        v-flex.pa-4(v-for="(cat,i) in linkPool", :key="i" xs12 sm6 md4 lg3 xl2)
          div.d-flex.mb-3.subheading
            strong {{cat.heading}}
          div.my-1(v-for="(subcat,ii) in cat.pool", :key="subcat.id" flat small)
            router-link.grey--text.text--darken-1.custom-shortcut(:to="'catalog/'+cat.id+'/'+subcat.id") {{subcat.title}}
</template>

<script>

//import HelloWorld from '@/components/HelloWorld.vue'
export default {
  components: {
    
  },
  data(){
    return {
      linkPool: this.$store.state.categories
    }
  }
}
</script>

<style lang="sass">
.custom-shortcut
  &:hover
    color: #e01a4f !important
</style>


<template lang="pug">
v-breadcrumbs.pa-0(divider="/")
  v-breadcrumbs-item(v-for="item in items", :key="item.text") {{ item }}
</template>

<script>
export default {
  components: {},
  props: { 
    direct: { type: Array },
    fromCatalogRoute: { type: Object },
    fromProductRoute: { type: Array },
  },
  computed: {
    items() {
      if(this.fromCatalogRoute) {
        const category = this.$store.state.shop.map.find(e=>e.path===this.fromCatalogRoute.params.categoryPath)
        const subcategory = category.subcategories.find(e=>e.path===this.fromCatalogRoute.params.subcategoryPath)
        return [category.title,subcategory.title]
      }
    }
  }
}
</script>

<style lang="sass">
</style>


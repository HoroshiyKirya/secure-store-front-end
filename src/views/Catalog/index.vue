<template lang="pug">
  //-Catalog_TotalNavView(v-if="!$route.params.categoryPath")
  v-container
    v-layout(column)
      Breadcrumbs(v-if="$route.name=='catalog'", :fromCatalogRoute="$route")
      div(v-if="$route.name=='catalog'").mt-3.headline.grey--text.text--darken-3(style="text-transform: uppercase;") {{$store.getters['shop/currentSubcategoryTitle']}}
    v-layout(justify-center v-if="!$store.getters['shop/isProductsLoaded']"): v-progress-circular.mt-5(indeterminate color="primary" size="48")
    v-layout.mt-4(v-else)
      v-flex
        Catalog_List(:filters="filters")
      div.pl-3.hidden-sm-and-down(ref="static_filter_wrapper")
        Catalog_StaticFilters(:threshold="filterWrapperOffset - 48", :offset="48", mode="sticky")
          Catalog_FilterLayout(@onFiltersChange="_applyFilters")
</template>

<script>
import { ACTIONS as USER_ACTIONS } from '@/store/UserStore'
import { ACTIONS as SHOP_ACTIONS } from '@/store/ShopStore'

import Breadcrumbs from '@/views-partials/Breadcrumbs'

import Catalog_FilterLayout from './_FilterLayout'
import Catalog_StaticFilters from './_StaticFilters'
import Catalog_List from './_List'
import Catalog_TotalNavView from './_TotalNavView'

export default {
  components: {
    Breadcrumbs,
    Catalog_FilterLayout,
    Catalog_StaticFilters,
    Catalog_List,
    Catalog_TotalNavView,
  },
  props: {
    directRoute: {type: Boolean}
  },
  data: () => ({
    filterWrapperOffset: 0,
    filters: null
  }),
  methods: {
    _applyFilters(filters) {
      //console.log('apply filters > ', filters)
      this.filters = filters
    },
    _updateSubcategory(catPath, subcatPath) {
      this.$store.dispatch(`shop/${SHOP_ACTIONS.GET_PRODUCTS_BY_SUBCATEGORY}`, {
        categoryPath: catPath,
        subcategoryPath: subcatPath,
      })
    },
    _setProductsFromQuery(query) {
      this.$store.dispatch(`shop/${SHOP_ACTIONS.GET_PRODUCTS_FROM_QUERY}`, query)
    },
  },
  beforeRouteEnter(to, from, next) {
    //console.log('before route enter', to.name, to)
    next(e => {
      if(to.name == 'catalog') e._updateSubcategory(to.params.categoryPath, to.params.subcategoryPath)
      if(to.name == 'catalog_search') e._setProductsFromQuery(to.query.q)
    })
    //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
  },
  beforeRouteUpdate(to, from, next) {
    //console.log('before route update', to)
    if(to.name == 'catalog')  this._updateSubcategory(to.params.categoryPath, to.params.subcategoryPath)
    if(to.name == 'catalog_search') this._setProductsFromQuery(to.query.q)
    next()
  },
  mounted() {}
}
</script>

<style lang="sass">

</style>


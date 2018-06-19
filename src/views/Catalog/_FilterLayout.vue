<template lang="pug">
v-list.elevation-1.custom-expansion-list(style="width:300px")
  template(v-if="subcategoriesForFilter.length > 1")
    v-divider
    v-expansion-panel.elevation-0(expand)
      v-expansion-panel-content(:value="true")
        v-subheader(slot="header") Категория товара
        v-card(flat)
          v-layout(column)
            v-flex.pl-3(v-for="subc in subcategoriesForFilter", :key="subc")
              v-checkbox(:label="$store.getters['shop/subcategoryTitleFromId'](subc)", hide-details color="primary" @change="emitOnFiltersChange", :value="subc" v-model="subcategoriesModels")
  template(v-for="filter in filters")
    v-divider
    v-expansion-panel.elevation-0(expand :key="filter.id")
      v-expansion-panel-content(:value="true")
        v-subheader(slot="header") {{filter.title}}
        v-card(flat)
          v-layout(v-if="filter.type === 'string'" column)
            v-flex.pl-3(v-for="(val,ii) in filter.values",:key="val")
              v-checkbox(:label="val", hide-details color="primary", @change="e => applyStringFilter(filter, val, e)"  v-model="checkBoxSurrogate[`${filter.paramId}.${val}`]")
          v-layout.mb-2(v-if="filter.type === 'number'" row)
            v-flex.px-1.pl-2(sm6)
              v-text-field.custom-expansion-list-range-input(solo prefix="От", :placeholder="filter.valueFrom.toString()" @change="e=>applyNumberFilter(filter,'from',e)")
            v-flex.px-1.pr-2(sm6)
              v-text-field.custom-expansion-list-range-input(solo prefix="До", :placeholder="filter.valueTo.toString()" @change="e=>applyNumberFilter(filter,'to',e)")
</template>

<script>

export default {
  components: {},
  data: () => ({
    filtersModels: {},
    subcategoriesModels: [],
    checkBoxSurrogate: {},
  }),
  watch: {},
  methods: {
    emitOnFiltersChange() {
      this.$emit('onFiltersChange', {
        params: this.filtersModels,
        subcategories: this.subcategoriesModels,
      })
    },
    applyNumberFilter(filter,x,val) {
      console.log('number filter>', arguments)
      if(!this.filtersModels[filter.paramId]) {
        this.filtersModels[filter.paramId] = {}
        this.filtersModels[filter.paramId].from = filter.valueFrom
        this.filtersModels[filter.paramId].to = filter.valueTo
      }
      if(val == '') {
        if(x == 'from') this.filtersModels[filter.paramId].from = filter.valueFrom
        if(x == 'to') this.filtersModels[filter.paramId].to = filter.valueTo
        if(this.filtersModels[filter.paramId].from == filter.valueFrom && this.filtersModels[filter.paramId].to == filter.valueTo)
          delete this.filtersModels[filter.paramId]
        //console.log('current filters>',this.filtersModels)
        this.emitOnFiltersChange()
        return
      }
      const value = parseInt(val)
      if(isNaN(value)) return console.log('reject number parse', val)
      if(x == 'from' && value < this.filtersModels[filter.paramId].to) this.filtersModels[filter.paramId].from = value
      if(x == 'to' && value > this.filtersModels[filter.paramId].from) this.filtersModels[filter.paramId].to = value
      this.emitOnFiltersChange()
      //console.log('current filters>',this.filtersModels)
    },
    applyStringFilter(filter,fval,val) {
      if(val == true) {
        if(!this.filtersModels[filter.paramId]) this.filtersModels[filter.paramId] = [fval]
        else this.filtersModels[filter.paramId].push(fval)
      }
      if(val == false) {
        const index = this.filtersModels[filter.paramId].findIndex(e => e == fval)
        this.filtersModels[filter.paramId].splice(index, 1)
        if(this.filtersModels[filter.paramId].length == 0) delete this.filtersModels[filter.paramId]
      }
      //console.log('current filters>',this.filtersModels)
      this.emitOnFiltersChange()
    },
    isStringParamEnabled(paramId, value) {
      if(!this.filtersModels[paramId]) return false
      return this.filtersModels[paramId].findIndex(e => e === value) !== -1
    }
  },
  computed: {
    subcategoriesForFilter() {
      return this.$store.getters['shop/currentProductsFiltersMap'].subcategories
    },
    filters() {
      //console.log('on filters get')
      const filters = this.$store.getters['shop/currentProductsFiltersMap'].params
      this.filtersModels = {}
      return filters
    }
  },
  mounted() {}
}
</script>

<style lang="sass">
.custom-expansion-list
  .expansion-panel__header
    padding: 5px 10px 5px 5px
  &-range-input
    .input-group__input
      padding: 4px 8px !important
    .input-group--text-field__prefix
      margin-right: 5px
</style>


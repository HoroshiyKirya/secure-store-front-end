<template lang="pug">
  v-container.py-4
    v-layout(row)
      router-link.mr-5.hidden-sm-and-down(to="/")
        img.hidden-sm-and-down(src="../assets/logo_min_dark.png")
      v-flex
        v-form(@submit.prevent="_onSubmitSearch")
          v-text-field.elevation-1(solo clearable prepend-icon="mdi-magnify" label="Поиск" v-model="searchModel")
        v-layout.mt-3(row)
          div.body-2.mr-3 664433 
          div.body-2.mr-3 WhatsApp
          div.body-2.mr-3 inbox@securestore.com
      div.ml-5.hidden-sm-and-down
        v-flex(v-for="(phone, i) in [{city:'Брянск',phone:'+7 (495) 646-85-80'},{city:'Брянск',phone:'+7 (812) 643-20-10'},{city:'Брянск',phone:'+7 (978) 769-24-44'}]", :key="i")
          v-layout(row align-center)
            strong {{phone.phone}}
            div.body-2.ml-2(style="width:130px") {{phone.city}}
</template>

<script>
export default {
  components: {},
  data: () => ({
    searchModel: ''
  }),
  methods: {
    _onSubmitSearch(e) {
      this.$router.push({ path: '/catalog/search' , query: {q:this.searchModel} }) //name: 'catalog_search'
      this.searchModel = ''
    }
  }
}
</script>

<style lang="sass">

</style>


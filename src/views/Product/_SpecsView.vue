<template lang="pug">
v-layout.pa-2(column v-if="$store.state.shop.paramsMap")
  div.grey.lighten-4.mb-1.py-2.px-3(v-for="(param,i) in params", :key="i")
    v-layout
      v-flex.grey--text.text--darken-2 {{param.param.title}}
      div {{param.value}}
</template>

<script>

//import HelloWorld from '@/components/HelloWorld.vue'
export default {
  components: {},
  props: {
    params: {type:Array}
  },
  data: () => ({}),
  computed: {}
}
</script>

<style lang="sass">

</style>


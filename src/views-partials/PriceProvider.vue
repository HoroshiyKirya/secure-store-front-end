<template lang="pug">
span(style="white-space: nowrap") {{ normilizedPrice }}  
  span(style="font-size:0.8em") руб.
</template>

<script>

//import HelloWorld from '@/components/HelloWorld.vue'
export default {
  components: {},
  props:{
    value: { type:[String, Number], required:true }
  },
  methods: {
    normilize: e => e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  },
  computed: {
    normilizedPrice() { return this.normilize(this.value) }
  }
}
</script>

<style lang="sass">

</style>


<template lang="pug">
span(style="white-space: nowrap") {{ normilizedDate }}  
</template>

<script>
import moment from 'moment' // /min/moment-with-locales.min.js'

export default {
  components: {},
  props:{
    value: { type:[String, Number], required:true }
  },
  methods: {
    normilize: e => e.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")
  },
  computed: {
    normilizedDate() { return moment(this.value).locale('RU').fromNow() }
  }
}
</script>

<style lang="sass">

</style>


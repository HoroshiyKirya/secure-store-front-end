<template lang="pug">
span.grey--text.caption.text--darken-1 Гарантия: 
  span.black--text {{ value }} мес.
</template>

<script>

//import HelloWorld from '@/components/HelloWorld.vue'
export default {
  components: {},
  props: { value:{type:Number, required:true} }
}
</script>

<style lang="sass">

</style>


<template lang="pug">
v-flex(:class="{'px-3':!inlineX,'py-3':!inlineY}")
  slot
</template>

<script>
export default {
  components: {},
  props: {'inlineY':{type:Boolean}, 'inlineX':{type:Boolean}},
}
</script>

<style lang="sass">

</style>


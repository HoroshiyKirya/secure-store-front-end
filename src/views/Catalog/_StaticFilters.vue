<template lang="pug">
div.d-flex(:style="styles" v-scroll="mode==='manual'?onScroll:null")
  slot
</template>

<script>

export default {
  components: {},
  props: {
    offset: { type: [Number, String], required: true },
    threshold: { type: [Number, String], required: true },
    mode: { type: String, required: true }
  },
  data: () => ({
    currentOffset: 0,
    position: 'relative',
    top: 0,
  }),
  computed: {
    styles () {
      return {
        position: this.position,
        top: `${parseInt(this.top)}px`
      }
    }
  },
  methods: {
    onScroll () {
      console.log('scroll track')
      this.currentOffset = window.pageYOffset || document.documentElement.offsetTop
      const shouldFloat = this.currentOffset >= this.threshold
      this.position = shouldFloat ? 'fixed' : 'relative'
      this.top = shouldFloat ? this.offset : 0
    }
  },
  mounted() {
    if (this.mode === 'sticky') {
      this.position = 'sticky'
      this.top = this.offset
    }
    if (this.mode === 'manual') {
      this.position = 'relative'
      this.top = 0
    }
  }
}
</script>

<style lang="sass">

</style>


<template lang="pug">
  v-fab-transition
    v-btn(fab dark fixed bottom right
      :small="this.$vuetify.breakpoint.smAndDown"
      v-scroll="onScroll"
      v-show="fab"
      @click="toTop")
      v-icon mdi-chevron-up
</template>

<script>
  export default {
    data: () => ({
      fab: false
    }),
    methods: {
      onScroll () {
        if (typeof window === 'undefined') return
        const top = window.pageYOffset || document.documentElement.offsetTop || 0
        this.fab = top > 200
      },
      toTop () {
        this.$router.push({ hash: '' })
        this.$vuetify.goTo(0)
      }
    }
  }
</script>
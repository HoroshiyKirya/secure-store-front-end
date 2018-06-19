<template lang="pug">
v-snackbar(
  :timeout="6000"
  :right="true"
  :top="true"
  v-model="isShown") Необходима авторизация
  v-btn(flat @click.native="isShown = false") OK

</template>

<script>
export default {
  components: {},
  data: () => ({
    isShown: false,
  }),
  methods: {
    show() {
      this.isShown = true
    }
  }
}
</script>

<style lang="sass">

</style>


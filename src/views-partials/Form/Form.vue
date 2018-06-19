<template lang="pug">
v-card.grey.lighten-3.custom-form(:style="{'max-width':double?'inherit':'inherit'}")
  v-form
    v-layout(row wrap)
      slot
      v-flex(xs12).px-3.pb-3
        v-layout(:column="$vuetify.breakpoint.smAndDown" align-center justify-space-between)
          slot(name="beforeBefore")
          slot(name="actions")
</template>

<script>
export default {
  components: {},
  props: {
    double:Boolean
  }
}
</script>

<style lang="sass">
.custom-form
  &-price
    text-align: center
    font-weight: 900
    font-size: 26px
  &-subheader
    height: initial
    font-weight: 500
    margin-top: 24px
  &-form-toggle
    justify-content: flex-end !important
    .input-group__input
      width: initial !important
      flex-grow: 0 !important
      flex-basis: auto !important
</style>


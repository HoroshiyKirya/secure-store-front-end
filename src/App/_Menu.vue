<template lang="pug">
v-toolbar.hidden-md-and-down(flat)
  v-layout(column)
    v-divider
    v-container.pa-0.my-0
      v-layout(column)
        v-toolbar.custom-menu(flat)
          div.divider.custom-menu-divider.ml-0
          v-toolbar-items.mx-0(v-for="(cat,i) in $store.state.shop.map",:key="i")
            v-menu(offset-y open-on-hover transition="fade-transition" nudge-top="-5" open-delay="150")
              v-btn.custom-menu-btn(flat slot="activator", active-class="") {{cat.title}}
              v-list(dense)
                v-list-tile(v-for="(subcat,ii) in cat.subcategories", :key="ii", :to="'/catalog/'+cat.path+'/'+subcat.path")
                  v-list-tile-title {{subcat.title}}
            div.divider.custom-menu-divider
    v-divider
              
</template>

<script>
export default {
  components: {}
}
</script>

<style lang="sass">
.custom-menu-btn
  border-radius: 0px
  text-align: center
  .btn__content
    flex: 0 1 auto
    white-space: inherit
    padding: 0 12px
.custom-menu
  .toolbar__content
    justify-content: center
.custom-menu-divider
  width: 1px
  max-width: 1px
  min-width: 1px
  height: 100%
</style>


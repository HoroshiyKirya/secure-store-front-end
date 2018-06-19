<template lang="pug">
  #app
    template(v-if="!appIsReady")
      v-app
        v-container(fluid fill-height)
          v-layout(justify-center align-center column)
            img.hidden-sm-and-down(src="../assets/logo_full_big_dark.png" style="opacity:0.1")
            v-progress-circular.mt-5(indeterminate color="primary" size="48")
    v-app(v-else)
      template(v-if="false")
        v-progress-linear(:indeterminate="true" height="2" style="margin:0;z-index:200;position: absolute;")
      App_Toolbar(@onDrawerToggle="$refs.drawer.toggle()")
      App_Drawer(ref="drawer")
      App_ToTopFab
      v-content
        App_Header
        App_Menu()
        transition(name="content-appearance" mode="out-in")
          router-view(:key="$route.path")
      App_Footer
</template>

<script>
import { ACTIONS as USER_ACTIONS } from '@/store/UserStore'
import { ACTIONS as SHOP_ACTIONS } from '@/store/ShopStore'
import App_Toolbar from   './_Toolbar'
import App_Header from    './_Header'
import App_Menu from      './_Menu'
import App_Drawer from    './_Drawer'
import App_Footer from    './_Footer'
import App_ToTopFab from  './_ToTopFab'

export default {
  components: {
    App_Toolbar,
    App_Header,
    App_Menu,
    App_Footer,
    App_Drawer,
    App_ToTopFab,
  },
  computed: {
    appIsReady() { return (this.$store.state.shop.map && this.$store.state.shop.paramsMap && this.$store.state.shop.services) ? true : false }
  },
  mounted() { 
    this.$store.dispatch(`user/${USER_ACTIONS.PERFORM_AUTH}`)
    this.$store.dispatch(`shop/${SHOP_ACTIONS.LOAD_MAP}`)
    this.$store.dispatch(`shop/${SHOP_ACTIONS.LOAD_PARAMS_MAP}`)
    this.$store.dispatch(`shop/${SHOP_ACTIONS.LOAD_SERVICES}`)
  }
}
</script>


<style lang="sass">
@import url('https://fonts.googleapis.com/css?family=Material+Icons|Roboto:100,100i,300,300i,400,400i,500,500i,700,700i,900,900i&subset=cyrillic,cyrillic-ext,latin-ext');
.content-appearance
  &-enter-active 
    transition: all .10s ease-out
  &-leave-active 
    transition: all .20s ease-in
  &-leave-to
    transform: translateX(-15px)
    opacity: 0
  &-enter
    transform: translateX(15px)
    opacity: 0

</style>

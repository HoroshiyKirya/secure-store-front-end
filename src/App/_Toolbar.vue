<template lang="pug">
  v-toolbar.custom-toolbar(app clipped-left dense style="box-shadow: 0 2px 25px rgba(0,0,0,.15)")
    OnlyForAuthorized(ref="onlyForAuthSnack")
    App_AuthModal(ref="authModal")
    App_DiagnosticsModal(ref="diagnosticsModal" v-if="$store.getters['user/ifAuthorized']")
    App_MaintainModal(ref="maintainModal" v-if="$store.getters['user/ifAuthorized']")
    App_PhoneOrderForm(ref="orderCallModal")
    v-toolbar-side-icon.hidden-lg-and-up(style="flex-shrink:0;" @click="$emit('onDrawerToggle')")
    v-toolbar(flat dense)
      v-toolbar-items.ml-0.hidden-sm-and-down
        v-btn(flat to="/about") о компании
        v-btn(flat @click="_ifAuth(e=>$refs.diagnosticsModal.toggle())") диагностика
        v-btn(flat @click="_ifAuth(e=>$refs.maintainModal.toggle())") обслуживание
        //-v-btn(flat to="/contact") контакты
      v-spacer
      v-btn.ml-1.hidden-md-and-down(flat small @click="$refs.orderCallModal.toggle()") заказать звонок
      v-tooltip(bottom)
        span Избранное
        v-btn(flat icon slot="activator" to="/favorites"): v-icon(dark) mdi-star
      v-badge.custom-toolbar-bage(overlap color="primary darken-1")
        div(slot="badge" v-if="$store.state.user.cartProducts && $store.state.user.cartProducts.list.length > 0") {{ $store.state.user.cartProducts.list.length }}
        v-btn(dark color="primary", :icon="this.$vuetify.breakpoint.smAndDown", to="/cart" ) 
          span(v-if="!this.$vuetify.breakpoint.smAndDown") Корзина
          v-icon(:right="!this.$vuetify.breakpoint.smAndDown" dark size="20px") mdi-cart
      v-tooltip.mr-0(bottom v-if="!$store.getters['user/ifAuthorized']")
        span Авторизация
        v-btn(flat icon style="flex-shrink:0;" slot="activator" @click="toggleAuthModal", :loading="$store.state.user.onLoadAwait"): v-icon mdi-key
      v-menu.mr-0(offset-y v-if="$store.getters['user/ifAuthorized']")
        v-btn(flat style="flex-shrink:0;" slot="activator") {{ $store.state.user.login }}
        v-card
          v-list
            v-list-tile(avatar)
              v-list-tile-content
                v-list-tile-title {{$store.state.user.login}}
                v-list-tile-sub-title {{$store.state.user.email}}
            v-list-tile(to="/orders"): v-list-tile-title Заказы
            v-divider
            v-list-tile(v-if="$store.state.user.role==='admin'", to="/admin"): v-list-tile-title Admin
            v-list-tile(@click="handleLogout"): v-list-tile-title Выход
            
</template>

<script>
import { ACTIONS as USER_ACTIONS } from '@/store/UserStore'
import App_AuthModal from './_AuthModal'
import App_PhoneOrderForm from './_PhoneOrderForm'
import App_DiagnosticsModal from './_DiagnosticsModal'
import App_MaintainModal from './_MaintainModal'
import OnlyForAuthorized from '@/views-partials/feedback/OnlyForAuthorized'

export default {
  components: {
    App_AuthModal,
    App_PhoneOrderForm,
    App_DiagnosticsModal,
    App_MaintainModal,
    OnlyForAuthorized,
  },
  props: ["onDrawerToggle"],
  methods: {
    toggleAuthModal() { this.$refs.authModal.toggle() },
    handleLogout() { 
      this.$store.dispatch(`user/${USER_ACTIONS.PERFORM_LOGOUT}`, {}).then(status => {
        this.$router.replace({ name: 'home' })
      })
    },
    _ifAuth(e) {
      if(this.$store.getters['user/ifAuthorized']) e()
      else this.$refs.onlyForAuthSnack.show()
    }
  },
}
</script>

<style lang="sass">
.custom-toolbar
  .custom-toolbar-bage .badge__badge
    width:auto
    border-radius: 11px
    padding: 0px 8px 0px 8px
    top: 2px
    right: 0px
</style>


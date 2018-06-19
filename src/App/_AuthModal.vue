<template lang="pug">
v-dialog(v-model="isShown", lazy
  :transition="$vuetify.breakpoint.smAndDown?'dialog-bottom-transition':'dialog-transition'", 
  :fullscreen="$vuetify.breakpoint.smAndDown"
  hide-overlay
  width="400"
  )
  v-card()
    v-btn.hidden-md-and-up(flat @click="toggle" fab fixed right top)
      v-icon mdi-close
    div(style="height:20px")
    transition(name="custom-tabs-fake-dismiss")
      v-tabs(v-if="isShown" v-model="tabsm" slider-color="primary" centered)
        v-tab(:ripple="false") Вход
        v-tab(:ripple="false") Регистрация
        v-tab-item
          v-card.d-flex(flat height="500")
            v-layout(column)
              v-alert(type="error" v-model="loginErrorAlert" style="margin:0" dismissible) {{$store.state.user.loginError}}
              v-form.px-5.pb-4.pt-4.d-flex(ref="loginForm" style="flex-grow: 1")
                v-layout(column style="display:flex")
                  v-text-field.custom-input(label="Логин" ref="logLogin" v-model="logLogin"
                    :rules="[inputAssertRules.notEmpty]")
                  v-text-field.custom-input(label="Пароль" ref="logPass" v-model="logPass"
                    :rules="[inputAssertRules.notEmpty]")
                  v-spacer.hidden-sm-and-down
                  v-layout(:column="$vuetify.breakpoint.smAndDown" align-center justify-end style="flex-grow:0")
                    v-btn(color="primary", :block="true" large @click="handleLogin", :loading="isLoginAwait") Вход
        v-tab-item
          v-card.d-flex(flat height="500")
            v-layout(column)
              v-alert(type="error" v-model="registerErrorAlert" style="margin:0" dismissible) {{$store.state.user.registerError}}
              v-form.px-5.pb-4.pt-4.d-flex(ref="registerForm" style="flex-grow: 1")
                v-layout(column style="display:flex")
                  v-text-field.custom-input(label="Логин"  v-model="regLogin" counter="10", hint="3-10 символов" persistent-hint ref="regLogin"
                    :rules="[inputAssertRules.notEmpty,inputAssertRules.length(3,10),_assertLogin]")
                  v-text-field.custom-input(label="Email"  v-model="regEmail", ref="regEmail"
                    :rules="[inputAssertRules.notEmpty,inputAssertRules.email]")
                  v-text-field.custom-input(label="Пароль" v-model="regPass", counter="25" hint="4-25 символов" persistent-hint ref="regPass"
                    :rules="[inputAssertRules.notEmpty,inputAssertRules.length(4,25),_assertPassword]")
                  v-text-field.custom-input(label="Пароль еще раз" v-model="regPassAssert", ref="regPassAssert"
                    :rules="[inputAssertRules.notEmpty,_assertPasswordAssert]")
                  v-spacer.hidden-sm-and-down
                  v-layout(:column="$vuetify.breakpoint.smAndDown" align-center justify-end style="flex-grow:0")
                    v-btn(color="primary", :block="true" large @click="handleRegister", :loading="isRegisterAwait") Регистрация
</template>

<script>
import inputAssertRules from '@/views-utils/inputAssertRules'
import { ACTIONS as USER_ACTIONS } from '@/store/UserStore'
export default {
  components: {},
  data: () => ({
    inputAssertRules,
    isShown: false,
    tabsm: null,
    logLogin: '',
    logPass: '',
    regLogin: '',
    regEmail: '',
    regPass: '',
    regPassAssert: '',
    isLoginAwait: false,
    isRegisterAwait: false,
    loginErrorAlert: false,
    registerErrorAlert: false,
  }),
  props: { },
  methods: {
    toggle() { this.isShown = !this.isShown },
    handleRegister() {
      this.isRegisterAwait = true
      this.registerErrorAlert = false
      const res = Object.keys(this.registerForm).reduce((val, f) => val & this.$refs[f].validate(true), true)
      if(res) this.$store.dispatch(`user/${USER_ACTIONS.PERFORM_REGISTER}`, { 
        login:    this.regLogin,
        email:    this.regEmail,
        password: this.regPass,
      }).then(status => {
        if(!status.isError) this.isShown = false
        else this.registerErrorAlert = true
        this.isRegisterAwait = false
      })
      else this.isRegisterAwait = false
    },
    handleLogin() {
      this.isLoginAwait = true
      this.loginErrorAlert = false
      const res = Object.keys(this.loginForm).reduce((val, f) => val && this.$refs[f].validate(true), true)
      if(res) this.$store.dispatch(`user/${USER_ACTIONS.PERFORM_LOGIN}`, { 
        login:    this.logLogin,
        password: this.logPass,
      }).then(status => {
        if(!status.isError) this.isShown = false
        else this.loginErrorAlert = true
        this.isLoginAwait = false
      })
      else this.isLoginAwait = false
    },
    _assertLogin(e) { return /^[a-zA-Z0-9_]{3,10}$/.test(e) ? true : 'Неправильный логин' },
    _assertPassword(e) { return /^[a-zA-Z0-9_]{4,20}$/.test(e) ? true : 'Неправильный пароль' },
    _assertPasswordAssert(e) { return this.regPass === this.regPassAssert ? true : 'Пароли должны совпадать' },
  },
  computed: {
    loginForm() {
      return {
        logLogin: this.logLogin,
        logPass:  this.logPass,
      }
    },
    registerForm() {
      return {
        regLogin:   this.regLogin,
        regEmail:   this.regEmail,
        regPass:    this.regPass,
        regPassAssert: this.regPassAssert,
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.custom-input
  flex-grow: 0
  flex-basis: auto
.custom-tabs-fake-dismiss
  &-enter-active  
    transition: all 0s ease-out
  &-leave-active 
    transition: all 1s ease-in
  &-leave-to
    opacity: 0
  &-enter
    opacity: 0
</style>


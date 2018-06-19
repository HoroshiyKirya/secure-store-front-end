<template lang="pug">
section
  v-parallax(:src="require('@/assets/header_bg.png')" height="400")
    v-layout.white--text(column align-center justify-center)
      img(src="@/assets/logo_full_big_light.png" style="user-select: none;")
</template>

<script>
export default {
  name: 'home',
  components: {}
}
</script>

<template lang="pug">
v-card(:flat="flat")
  v-card-media.hidden-sm-and-up(:src="`http://localhost:3000/uploads/products/${data.image}`", :height="dense?150:200" contain)
  v-layout(:row="!this.$vuetify.breakpoint.xsOnly" , :column="this.$vuetify.breakpoint.xsOnly")
    router-link.hidden-xs-only.white(:style="{width:'150px','flex-shrink':0,'min-height':dense?'100px':'150px'}", :to="to||null")
      div(:style="{ height:'100%',width:'100%','background': 'url(http://localhost:3000/uploads/products/' + data.image + ') center center / contain no-repeat'}")
    v-layout(:column="this.$vuetify.breakpoint.mdAndDown")
      v-flex(d-flex sm9 md9 lg10 xl11)
        v-layout.mx-3(column)
          router-link(:to="to||null" style="text-decoration: none;"): h4.mt-3.black--text.title {{ data.literals.brand }} {{ data.title }}
          div.mt-1.caption.green--text(v-if="(data.accounting.inStock > 0)&&!nocounter") В наличии: {{data.accounting.inStock}}
          div.mt-1.caption.red--text(v-else-if="!nocounter") Нет в наличии
          p.caption.mt-2(style="flex:1") {{ data.literals.description }}
          //-WarrantyProvider(:value="data.warranty")
      slot(name="actions", :item="data")
      
</template>

<script>
import WarrantyProvider from '@/views-partials/WarrantyProvider'
export default {
  components: {
    WarrantyProvider
  },
  props: {
    flat: { type: Boolean },
    dense: { type: Boolean },
    data: { type:Object, required:true },
    to: { type:String },
    nocounter: {type:Boolean}
  },
  data: () => ({}),
}
</script>

<style lang="sass">
.custom-product-card
  &-price
    text-align: center
    font-weight: 900
    font-size: 18px
</style>

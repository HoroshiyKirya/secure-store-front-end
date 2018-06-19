<template lang="pug">
    v-data-iterator(content-tag="v-layout" column, :items="[...orders].reverse()")
      v-layout(column slot="item" slot-scope="props")
        v-expansion-panel.elevation-0
          v-expansion-panel-content(:value="$route.query.order ? $route.query.order == props.item.data._id : false")
            v-layout(slot="header" column).pr-4
              slot(name="extra-header-slotx-big", :item="props.item")
              v-layout(:column="$vuetify.breakpoint.smAndDown" justify-space-between v-if="!headerless")
                div Заказ: 
                  strong {{props.item.data._id}}
                DateTimeProvider(:value="props.item.data.date")
              v-layout(:column="$vuetify.breakpoint.smAndDown" justify-space-between v-if="!headerless")
                slot(name="extra-header-slotx", :item="props.item")
                PriceProvider(:value="props.item.productsData.reduce((a,e)=>a+parseInt(e.literals.price)*props.item.data.products.find(x=>x.productId==e._id).amount,0)")
            v-card(flat).grey.lighten-4
              v-layout(row wrap).white
                v-flex(xs12 sm6): v-layout(column).pa-3
                  v-flex Имя: {{props.item.data.info.recipient.name}}
                  v-flex Email: {{props.item.data.info.recipient.email}}
                  v-flex Телефон: {{props.item.data.info.recipient.phone}}
                  v-flex Адрес: {{props.item.data.info.recipient.address}}
                v-flex(xs12 sm6): v-layout(column).pa-3
                  v-flex Доствка: {{$store.getters['shop/serviceByServiceName']('delivery').types.find(e=>e._id==props.item.data.info.delivery.type).title}}
                  v-flex Цена доставки: {{$store.getters['shop/serviceByServiceName']('delivery').types.find(e=>e._id==props.item.data.info.delivery.type).price}}
                  div(xs12 sm6 v-if="props.item.data.info.mount!=false"): v-layout(column)
                    v-flex Монтаж: {{$store.getters['shop/serviceByServiceName']('mount').types.find(e=>e._id==props.item.data.info.mount.type).target}}
                    v-flex Цена монтажа: {{$store.getters['shop/serviceByServiceName']('mount').types.find(e=>e._id==props.item.data.info.mount.type).multiplier*props.item.productsData.reduce((a,e)=>a+parseInt(e.literals.price_mount),0)}}
              v-divider
              v-data-iterator(content-tag="v-layout" column :items="props.item.productsData")
                v-layout(column slot="item" slot-scope="propsItem")
                  ProductCardFull(:data="propsItem.item", :to="'/product/'+propsItem.item._id" flat dense nocounter).grey.lighten-5
                    v-flex(d-flex sm3 md3 slot="actions" slot-scope="propsItemData").pa-3
                      v-layout(:column="$vuetify.breakpoint.smAndUp" align-center justify-center)
                        div Количество:   
                        strong {{props.item.data.products.find(e=>e.productId==propsItemData.item._id).amount}}
                  v-divider
        v-divider
</template>

<script>
import ProductCardFull from '@/views-partials/ProductCardFull'
import PriceProvider from '@/views-partials/PriceProvider'
import DateTimeProvider from '@/views-partials/DateTimeProvider'

export default {
  components: {
    ProductCardFull,
    PriceProvider,
    DateTimeProvider,
  },
  props: {
    orders: {type:Array},
    extractor: {type:Function},
    headerless: {type:Boolean}
  },
  data: () => ({}),
}
</script>

<style lang="sass">

</style>


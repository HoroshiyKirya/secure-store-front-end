<template lang="pug">
v-layout.pa-2(column)
  div.mb-3(v-for="comment in product.comments", :key="comment.id")
    v-layout(column) 
      v-layout.py-1.px-3(align-center)
        div.subheading.grey--text.text--darken-2 {{comment.from}}
        v-spacer
        DateTimeProvider.caption(:value="comment.date")
        v-btn(small flat @click="_handleDelete(comment._id)" v-if="$store.state.user.role==='admin'" color="red") Удалить
      v-layout.pa-4.grey.lighten-4(column) 
        div.body-1 {{comment.text}}
  v-layout(v-if="!$store.getters['user/ifAuthorized']" justify-center).pa-5.grey--text Комментарии могут оставлять только авторизованные пользователи.
  v-card.grey.lighten-3(v-else)
    v-flex.pa-3
      div.headline ОСТАВИТЬ ОТЗЫВ
      v-form(ref="commentForm" lazy-validation)
        v-layout(row wrap)
          v-flex.px-1(sm12 md6)
            v-text-field(label="Имя" box v-model="cfNmae"
              :rules="[inputAssertRules.notEmpty]")
          v-flex.px-1(sm12 md6)
            v-text-field(label="Email" box v-model="cfEmail"
              :rules="[inputAssertRules.notEmpty,inputAssertRules.email]")
          v-flex.px-1(md12)
            v-text-field(box textarea label="Отзыв", v-model="cfComment"
              :rules="[inputAssertRules.notEmpty]")
    v-flex(xs12).px-3.pb-3
      v-layout(:column="$vuetify.breakpoint.smAndDown" align-center justify-end)
        v-btn(color="primary", :block="$vuetify.breakpoint.smAndDown" large @click="_handleComment") Отправить
</template>

<script>
import DateTimeProvider from '@/views-partials/DateTimeProvider'
import inputAssertRules from '@/views-utils/inputAssertRules'
import api from '@/api'

export default {
  components: {
    DateTimeProvider,
  },
  props: {
    product: {type:Object},
    onnewcomments: {type:Function}
  },
  data: () => ({
    inputAssertRules,
    cfNmae: null,
    cfEmail: null,
    cfComment: null,
    onAddAwait: false,
  }),
  methods: {
    _handleComment() {
      let canAdd = true
      canAdd = canAdd & this.$refs.commentForm.validate()
      if(canAdd) {
        this.onAddAwait = true
        api.v1.shop.productComment({
          productId: this.product._id,
          data: {
            from: this.cfNmae,
            text: this.cfComment,
          }
        }).then(response => {
          this.onAddAwait = false
          this.onnewcomments(response.data.info)
        })
      }
    },
    _handleDelete(cid) {
      api.v1.kernel.products.comments.remove({
        productId: this.product._id,
        commentId: cid
      }).then(response => {
        this.onnewcomments(response.data.info)
      })
    }
  }
}
</script>

<style lang="sass">

</style>


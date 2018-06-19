<template lang="pug">
div
  v-text-field(box hide-details
    v-model="filename", :label="label", :required="required"
    @click.native="onFocus" prepend-icon="mdi-attachment"
    :disabled="disabled" ref="fileTextField")
  input(type="file", :accept="accept", :multiple="false", :disabled="disabled" ref="fileInput" @change="onFileChange")
</template>
<script>
export default {
  props: {
    accept: { type: String,default: "*" },
    label: { type: String, default: "" },
    required: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    // not yet possible because of data
    multiple: { type: Boolean, default: false }
  },
  data() {
    return {
      filename: ""
    };
  },
  methods: {
    getFormData(files) {
      const data = new FormData();
      [...files].forEach(file => {
        data.append('data', file, file.name); // currently only one file at a time
      });
      return data;
    },
    onFocus() {
      if (!this.disabled) {
        //debugger;
        this.$refs.fileInput.click();
      }
    },
    onFileChange($event) {
      const files = $event.target.files || $event.dataTransfer.files;
      const form = this.getFormData(files);
      if (files) {
        if (files.length > 0) {
          this.filename = [...files].map(file => file.name).join(', ')
        } else {
          this.filename = null;
        }
      } else {
        this.filename = $event.target.value.split('\\').pop()
      }
      this.$emit('input', files)
      //this.$emit('input', this.filename)
      this.$emit('formData', form)
    }
  }
};
</script>
<style scoped>
    input[type=file] {
        position: absolute;
        left: -99999px;
    }
</style>
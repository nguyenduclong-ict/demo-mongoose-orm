<template>
  <div>
    <vue-json-pretty :data="entity"></vue-json-pretty>
  </div>
</template>

<script>
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'
export default {
  components: {
    VueJsonPretty,
  },
  props: {
    schema: {
      type: Object,
    },
    fields: {
      type: Object,
    },
    useSchema: {
      type: Boolean,
      default: true,
    },
    entity: {
      type: Object,
    },
  },
}
</script>

<style lang="scss" scoped></style>

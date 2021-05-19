<template>
  <el-date-picker
    v-model="value"
    v-bind="dateProps"
    @change="handleChange"
  ></el-date-picker>
</template>

<script>
export default {
  props: {
    dateProps: {
      type: Object,
    },
    field: {
      type: String,
    },
    convert: {
      type: Function,
    },
    default: {
      type: Date,
      default: Date.now(),
    },
  },
  data() {
    return {
      value: this.default,
    }
  },
  methods: {
    handleChange(value) {
      this.$emit(
        'filterDate',
        this.convert ? this.convert(value) : { [this.path]: value }
      )
    },
  },
}
</script>

<style lang="scss" scoped></style>

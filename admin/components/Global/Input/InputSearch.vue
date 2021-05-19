<template>
  <el-input
    v-model="cValue"
    class="input-search"
    :placeholder="placeholder"
    :prefix-icon="prefixIcon"
    :suffix-icon="loading ? 'el-icon-loading' : ''"
    :size="size"
    @input="handleInput"
    @focus="handleFocus"
  ></el-input>
</template>

<script>
import { Lodash } from '~/utils'
export default {
  name: 'InputSearch',
  props: {
    placeholder: {
      type: String,
      default: 'Nhập để tìm kiếm...',
    },
    value: [String, Number],
    debounce: {
      type: Number,
      default: 500,
    },
    prefixIcon: {
      type: String,
      default: 'el-icon-search',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
    },
    searchOnFocus: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const data = {
      cValue: '',
    }
    data.handleInput = this.debounce
      ? Lodash.debounce(this.onInput, this.debounce)
      : this.onInput
    return data
  },
  watch: {
    value: {
      handler(v) {
        this.cValue = v
      },
      immediate: true,
    },
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
      this.$emit('search', value)
    },

    handleFocus() {
      console.log('handleFocus')
      if (this.searchOnFocus) {
        this.onInput(this.cValue)
      }
    },
  },
}
</script>

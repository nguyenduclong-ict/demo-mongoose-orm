<template>
  <img
    v-if="type === 'img'"
    class="app-icon"
    :src="require('./img/' + name.replace('img-', '') + '.png')"
    :style="{
      ..._size,
    }"
    v-on="$listeners"
  />
  <i
    v-else-if="type === 'element'"
    class="app-icon"
    :class="[name]"
    :style="{
      ..._size,
    }"
    v-on="$listeners"
  />
  <svg-icon
    v-else
    :name="name"
    :style="{
      ..._size,
    }"
    class="app-icon"
    v-on="$listeners"
  ></svg-icon>
</template>

<script>
export default {
  name: 'Icon',
  props: {
    name: {
      type: String,
      required: true,
      default: '',
    },
    size: {
      type: [String, Number],
    },
  },

  computed: {
    _size() {
      if (!this.size) return {}

      switch (this.type) {
        case 'img':
        case 'svg':
          return {
            width: this.parseSize(this.size),
            height: this.parseSize(this.size),
          }
        case 'element':
          return {
            fontSize: this.parseSize(this.size),
          }
        default:
          return {}
      }
    },
    type() {
      if (this.name.startsWith('img')) {
        return 'img'
      }

      if (this.name.startsWith('el-icon')) {
        return 'element'
      }

      return 'svg'
    },
  },

  methods: {
    parseSize(value) {
      if (/px$|rem$|em$/.test(value)) {
        return value
      }
      return value + 'px'
    },
  },
}
</script>

<style>
.svg-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  contain: strict;
  fill: currentColor;
  box-sizing: content-box !important;
}
</style>

<template>
  <button
    class="el-button"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button--' + type : '',
      buttonSize ? 'el-button--' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle,
        'icon-only': iconOnly,
      },
    ]"
    @click="handleClick"
  >
    <i v-if="loading" class="el-icon-loading"></i>
    <icon v-if="icon && !loading" :name="icon"></icon>
    <template v-if="!iconOnly">
      <span v-if="$slots.default">
        <slot></slot>
      </span>
      <span v-else>{{ text }}</span>
    </template>
  </button>
</template>

<script>
import { Button } from 'element-ui'
import { BUTTON_TEMPLATES } from './template'
export default {
  extends: Button,

  props: {
    template: {
      type: String,
    },
    icon: {
      type: String,
      default() {
        return BUTTON_TEMPLATES[this.$options.propsData.template]?.icon
      },
    },
    text: {
      type: String,
      default() {
        return BUTTON_TEMPLATES[this.$options.propsData.template]?.text
      },
    },
    type: {
      type: String,
      default() {
        return BUTTON_TEMPLATES[this.$options.propsData.template]?.type
      },
    },
    size: {
      type: String,
      default() {
        return BUTTON_TEMPLATES[this.$options.propsData.template]?.size
      },
    },
    iconOnly: {
      type: Boolean,
      default() {
        return (
          BUTTON_TEMPLATES[this.$options.propsData.template]?.iconOnly ?? false
        )
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.el-button {
  outline: none;
}
.icon-only.el-button--mini {
  padding: 7px;
  height: 28px;
}

.icon-only.el-button--default {
  padding: 12px;
  height: 40px;
}

.icon-only.el-button--medium {
  padding: 10px;
  height: 36px;
}

.icon-only.el-button--small {
  padding: 9px;
  height: 32px;
}
</style>

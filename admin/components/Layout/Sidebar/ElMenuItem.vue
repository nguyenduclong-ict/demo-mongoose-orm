<template>
  <li
    class="custom-menu-item el-menu-item"
    role="menuitem"
    tabindex="-1"
    :class="{
      'is-active': active,
      'is-disabled': disabled,
    }"
    :style="[itemStyle, { backgroundColor }]"
    @click="handleClick"
    @mouseenter="onMouseEnter"
    @focus="onMouseEnter"
    @blur="onMouseLeave"
    @mouseleave="onMouseLeave"
  >
    <router-link :to="route" class="router-link">
      <el-tooltip
        v-if="
          parentMenu.$options.componentName === 'ElMenu' &&
          rootMenu.collapse &&
          $slots.title
        "
        effect="dark"
        placement="right"
      >
        <div slot="content">
          <slot name="title"></slot>
        </div>
        <div
          style="
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
            display: inline-block;
            box-sizing: border-box;
            padding: 0 20px;
          "
        >
          <slot></slot>
        </div>
      </el-tooltip>
      <template v-else>
        <slot></slot>
        <slot name="title"></slot>
      </template>
    </router-link>
  </li>
</template>
<script>
import { MenuItem } from 'element-ui'
import menuMixin from './menu-mixin'
export default {
  extends: MenuItem,
  mixins: [menuMixin],
  props: {
    route: {
      type: [String, Object],
    },
  },
}
</script>

<style lang="scss">
.custom-menu-item {
  .router-link {
    padding: 0 20px;
    display: list-item;
  }

  &.el-menu-item {
    padding: 0px;
  }
}

.el-submenu {
  .custom-menu-item {
    .router-link {
      padding: 0 45px;
      display: list-item;
    }
  }
}
</style>

<template>
  <el-menu-item v-if="!hasChild" :index="item.name" :route="to">
    <icon v-if="item.meta.icon" :name="item.meta.icon"></icon>
    <template slot="title">
      <span class="pl-1 menu-item-title">
        {{ item.meta.title }}
      </span>
    </template>
  </el-menu-item>
  <el-submenu v-else :index="item.name">
    <template slot="title">
      <icon v-if="item.meta.icon" :name="item.meta.icon"></icon>
      <span class="pl-2 menu-item-title">
        {{ item.meta.title }}
      </span>
    </template>
    <SidebarItem
      v-for="child in item.children"
      :key="child.name"
      :item="child"
    ></SidebarItem>
  </el-submenu>
</template>

<script>
import { mapState } from 'vuex'
import ElSubmenu from './ElSubmenu'
import ElMenuItem from './ElMenuItem'

export default {
  name: 'SidebarItem',
  components: { ElSubmenu, ElMenuItem },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    hasChild() {
      return this.item.children?.length > 0
    },
    to() {
      if (this.item.route) return this.item.route
      if (this.item.name) {
        return { name: this.item.name }
      }
      if (this.item.path) {
        return this.item.path
      }
      return null
    },
    ...mapState(['sidebar']),
  },
}
</script>

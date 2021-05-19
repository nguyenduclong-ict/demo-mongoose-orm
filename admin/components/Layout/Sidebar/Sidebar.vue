<template>
  <el-scrollbar
    class="sidebar"
    :class="{ 'is-collapsed': sidebar.isCollapsed }"
  >
    <el-menu
      class="main-menu"
      :background-color="theme.sidebar.backgroundColor"
      :text-color="theme.sidebar.textColor"
      :active-text-color="theme.sidebar.activeTextColor"
      :default-active="active"
      :collapse="sidebar.isCollapsed"
    >
      <SidebarItem
        v-for="item in items"
        :key="item.name"
        :item="item"
      ></SidebarItem>
    </el-menu>
    <div class="overlay" @click="handleClose"></div>
  </el-scrollbar>
</template>

<script>
import { mapState } from 'vuex'
import SidebarItem from './SidebarItem.vue'
import { ROUTES } from '~/config/constants/routes'

export default {
  components: { SidebarItem },

  props: {
    items: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    let active
    if (this.$route.name === ROUTES.Entity) {
      active = 'Entity' + this.$route.params.name
    } else {
      active = this.$route.name
    }
    return {
      active,
    }
  },

  computed: {
    ...mapState(['sidebar', 'theme']),
  },

  watch: {
    $route() {
      let active
      if (this.$route.name === ROUTES.Entity) {
        active = 'Entity' + this.$route.params.name
      } else {
        active = this.$route.name
      }
      this.active = active
    },
  },

  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log('close Sidebar')
      this.$store.commit('TOGGLE_MENU', true)
    },
  },
}
</script>

<style lang="scss">
.sidebar.is-collapsed {
  .menu-item-title {
    display: none;
    transition: none;
  }
}
@media (max-width: 640px) {
  .sidebar.is-collapsed {
    display: none;
    .overlay {
      display: none;
    }
  }

  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 3000;
    @apply shadow-lg;

    .el-menu {
      z-index: 1;
    }

    .overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.15);
    }
  }
}

.sidebar {
  display: block;
  width: 210px;
  &.is-collapsed {
    width: 56px;
  }

  .main-menu.el-menu {
    height: 100vh;
  }

  .el-menu--collapse {
    width: 56px;
  }

  .app-icon {
    font-size: 16px;
    text-align: center;
    color: inherit;
  }

  > .el-scrollbar__wrap {
    overflow: auto !important;
  }
}
</style>

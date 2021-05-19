<template>
  <nav class="navbar">
    <div class="hamburger-container" @click="handleToggleMenu">
      <icon
        v-if="sidebar.isCollapsed"
        name="menu-close"
        class="hamburger"
      ></icon>
      <icon v-else name="menu-open" class="hamburger is-active"></icon>
    </div>

    <el-breadcrumb separator="/" class="flex items-center breadcrumb">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item
          v-for="route in routes"
          :key="route.name"
          :to="{ name: route.name }"
        >
          <span v-html="getRouteTitle(route)"></span>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
    <div class="flex-1"></div>
    <div id="control" class="pr-4 flex items-center"></div>
  </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(['sidebar', 'page']),
    routes() {
      return this.$route.matched
    },
  },

  methods: {
    handleToggleMenu() {
      this.$store.commit('TOGGLE_MENU')
    },
    getRouteTitle(route) {
      if (this.routes.indexOf(route) === this.routes.length - 1) {
        return this.page.title || route.meta?.title || route.name
      }
      return route.meta?.title || route.name
    },
  },
}
</script>

<style lang="scss" scoped>
nav.navbar {
  height: 48px;
  line-height: 48px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  overflow: hidden;
  background: #fff;
  display: flex;

  .hamburger-container {
    padding: 0px 14px;
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    .hamburger {
      display: inline-block;
      vertical-align: middle;
      width: 20px;
      height: 20px;
      &.is-active {
        transform: rotate(180deg);
      }
    }
  }
}
</style>

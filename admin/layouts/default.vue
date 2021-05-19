<template>
  <div
    id="layout-default"
    :class="{
      'fixed-header': fixedHeader,
    }"
  >
    <Sidebar :items="sidebarItems"></Sidebar>
    <el-scrollbar id="main">
      <Navbar></Navbar>
      <div id="page-content">
        <Nuxt />
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import Navbar from '~/components/Layout/Navbar/Navbar.vue'
import Sidebar from '~/components/Layout/Sidebar/Sidebar.vue'
export default {
  components: { Sidebar, Navbar },

  computed: {
    ...mapGetters(['sidebarItems']),
    ...mapState(['fixedHeader']),
  },
}
</script>

<style lang="scss">
#layout-default {
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;

  > aside.sidebar {
  }

  > #main {
    flex: 1;
    position: relative;
    > .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    > .el-scrollbar__bar.is-horizontal {
      display: none;
    }

    #page-content {
      padding: 1rem;
    }
  }

  &.fixed-header {
    nav.navbar {
      z-index: 1000;
      position: absolute;
      width: 100%;
      top: 0;
      left: 0;
    }

    #page-content {
      margin-top: 48px;
    }
  }
}
</style>

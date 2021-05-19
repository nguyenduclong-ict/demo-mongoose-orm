<template>
  <div>
    <el-form ref="form">
      <el-form-item label="Fixed Header">
        <el-switch
          :value="fixedHeader"
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="changeHeaderMode"
        ></el-switch>
      </el-form-item>

      <el-form-item label="Size">
        <el-select v-model="size" @change="handleChangeSize">
          <el-option
            v-for="s in ['default', 'mini', 'small', 'medium']"
            :key="s"
            :label="s"
            :value="s"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { EL_SIZE, FIXED_HEADER } from '~/config/constants'
import { changeSize } from '~/plugins/element-ui'
export default {
  data() {
    return {
      size: localStorage.getItem(EL_SIZE),
    }
  },

  computed: {
    ...mapState(['fixedHeader']),
  },

  methods: {
    handleChangeSize() {
      changeSize(this.size)
    },
    changeHeaderMode(value) {
      console.log(value)
      this.$store.commit('TOGGLE_FIXED_HEADER', value)
      localStorage.setItem(FIXED_HEADER, value)
    },
  },
}
</script>

<style lang="scss" scoped></style>

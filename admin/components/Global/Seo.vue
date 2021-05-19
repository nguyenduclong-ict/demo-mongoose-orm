<template>
  <div v-if="value" :id="cId" class="seo w-full inline-block">
    <el-collapse v-if="!elFormItem">
      <el-collapse-item title="SEO Setting">
        <div v-if="elForm" id="content"></div>
        <el-form v-else id="content"></el-form>
      </el-collapse-item>
    </el-collapse>
    <div v-else id="content"></div>

    <Teleport :to="`.seo#${cId} #content`">
      <el-form-item label="Title">
        <el-input v-model="value.title"></el-input>
      </el-form-item>
      <el-form-item label="Description">
        <el-input
          v-model="value.description"
          type="textarea"
          :autosize="{ minRows: 2 }"
        ></el-input>
      </el-form-item>
      <el-form-item label="Từ khóa" prop="keywords">
        <el-select
          v-model="value.keywords"
          class="w-full"
          allow-create
          default-first-option
          filterable
          multiple
        ></el-select>
      </el-form-item>
      <el-form-item label="Image">
        <MediaPicker v-model="value.image" />
      </el-form-item>
    </Teleport>
  </div>
</template>

<script>
import MediaPicker from './MediaPicker.vue'
import Teleport from './Teleport.vue'
export default {
  components: { Teleport, MediaPicker },
  inject: {
    elForm: {
      default: null,
    },
    elFormItem: {
      default: null,
    },
  },

  props: {
    value: {
      type: Object,
    },
  },

  data() {
    return {
      cId: 'seo-' + Math.random().toString(36).slice(2),
    }
  },

  watch: {
    value() {
      this.$emit('input', this.value)
    },
  },

  created() {
    if (!this.value) {
      this.$emit('input', {
        title: '',
        description: '',
        image: null,
        keywords: [],
      })
    }
  },
}
</script>

<style lang="scss" scoped></style>

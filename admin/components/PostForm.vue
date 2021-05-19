<template>
  <el-form ref="form" :model="form" :rules="rules">
    <el-form-item label="Tiêu đề" prop="title">
      <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item label="Đường dẫn" prop="path">
      <el-input v-model="form.path"></el-input>
    </el-form-item>

    <Seo v-model="form.seo"></Seo>

    <el-form-item label="Nội dung">
      <TinymceEditor v-model="form.content" class="w-full" />
    </el-form-item>

    <el-form-item label="Bài viết liên quan">
      <SelectEntity
        v-model="form.relatedPosts"
        v-bind="selectRelatedOpts"
        class="w-full"
      />
    </el-form-item>
  </el-form>
</template>

<script>
import Seo from './Global/Seo.vue'
import TinymceEditor from './Global/TinymceEditor.vue'
export default {
  components: {
    TinymceEditor,
    Seo,
  },
  props: {
    form: Object,
  },

  data() {
    return {
      rules: {
        title: {
          required: true,
          message: 'Tiêu đề không được bỏ trống',
        },
        path: {
          required: true,
          message: 'Đường dẫn không được bỏ trống',
        },
      },
      selectRelatedOpts: this.$initSelectEntity({
        service: this.$services.Post,
        labelKey: 'title',
        limit: 10,
        payload: {
          query: {
            isDraft: false,
          },
          pageSize: 1000,
        },
      }),
    }
  },
}
</script>

<style lang="scss" scoped></style>

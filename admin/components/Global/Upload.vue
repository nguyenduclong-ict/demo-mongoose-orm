<template>
  <div class="upload inline-flex" :style="{ height: _size }">
    <input
      v-show="false"
      ref="inputFile"
      type="file"
      :multiple="limit > 1"
      @input="handleFileChange"
    />
    <div
      v-for="item in items"
      :key="item.id"
      :style="{ height: _size, width: _size }"
      class="upload-item border flex rounded"
    >
      <img :src="item.url" class="w-full object-cover my-auto" />
      <div
        class="overlay absolute w-full h-full top-0 left-0 opacity-0 hover:opacity-100 hover:bg-gray-800 hover:bg-opacity-25 overflow-hidden"
      >
        <div class="upload-item-controls">
          <icon
            name="el-icon-zoom-in rounded bg-white shadow cursor-pointer"
            @click="handleView(item)"
          ></icon>
          <icon
            name="el-icon-delete rounded bg-white shadow cursor-pointer"
            @click="handleRemove(item)"
          ></icon>
        </div>
      </div>
    </div>
    <div
      v-if="items.length < limit"
      :style="{ width: _size, height: _size }"
      class="upload-item add-file-button flex justify-center items-center cursor-pointer border border-dashed bg-gray-200 rounded overflow-hidden"
      @click="pickFile"
    >
      <icon name="el-icon-plus"></icon>
    </div>

    <el-dialog
      :visible.sync="isShowPreview"
      custom-class="max-w-4xl"
      width="100%"
    >
      <div v-if="preview">
        <img class="w-full" :src="preview.url" />

        <div v-if="preview.entity" class="mt-2">
          <el-input
            v-model="preview.entity.meta.alt"
            placeholder="Nhập mô tả"
          ></el-input>
          <div slot="footer" class="mt-2 w-full text-right">
            <el-button type="primary" @click="handleUpdate">Lưu</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Lodash, Utils } from '~/utils'
export default {
  props: {
    size: {
      type: [Number, String],
      default: 48,
    },
    value: {
      type: [String, Array], // file url
    },
    limit: {
      type: Number,
      default: 1,
    },
    entites: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      items: [],
      preview: null,
      isShowPreview: false,
    }
  },

  computed: {
    _size() {
      return isNaN(this.size) ? this.size : this.size + 'px'
    },
  },

  created() {
    this.items = (this.limit > 1 ? this.value || [] : [this.value])
      .filter((e) => !!e)
      .map((url) => ({
        id: Utils.createUniqueId(),
        url,
        name: url,
        status: 'success',
      }))
  },

  methods: {
    pickFile() {
      this.$refs.inputFile.click()
    },

    handleFileChange(event) {
      const files = Array.from(event.target.files).slice(
        0,
        this.limit - this.items.length
      )
      event.target.value = ''
      files.forEach((file) => {
        const item = {
          id: Utils.createUniqueId(),
          url: URL.createObjectURL(file),
          name: file.name,
          status: 'uploading',
          progress: 0,
          response: null,
        }
        this.items.push(item)
        this.$services.Upload.upload(this.$axios, file, (progress) => {
          item.progress = progress
        })
          .then((response) => {
            item.response = response
            item.url = response.url
            item.status = 'success'
            if (this.limit > 1) {
              const value = this.value || []
              const index = this.items.findIndex((e) => e === item)
              value.splice(index, 0, item.url)
              this.$emit('input', value)
            } else {
              this.$emit('input', item.url)
            }
          })
          .catch((err) => {
            console.log('upload error', item, err)
            this.items.status = 'error'
          })
      })
    },

    handleView(item) {
      const preview = {
        ...item,
        entity: item.response || this.entites.find((e) => e.url === item.url),
      }
      if (preview.entity)
        preview.entity.meta = preview.entity.meta || {
          alt: '',
          description: '',
        }
      this.preview = Lodash.cloneDeep(preview)
      this.isShowPreview = true
    },

    async handleRemove(item) {
      Utils.removeItems(this.items, item, 'id')
      const entity =
        item.response || this.entites.find((e) => e.url === item.url)
      if (entity) {
        await this.$services.Media.delete(this.$axios, {
          query: { _id: entity.id },
        })
      }
    },

    async handleUpdate() {
      await this.$services.Media.update(this.$axios, {
        query: { _id: this.preview.entity.id },
        data: this.preview.entity,
      })
      this.isShowPreview = false
    },
  },
}
</script>

<style lang="scss" scoped>
.upload {
  .upload-item + .upload-item {
    @apply ml-1;
  }

  .upload-item {
    @apply mb-1;
    position: relative;

    .upload-item-controls {
      .app-icon {
        display: inline-block;
        cursor: pointer;
      }
      width: 100%;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>

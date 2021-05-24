<template>
  <div class="media-picker inline-flex flex-wrap w-full">
    <div
      v-for="(item, index) in items"
      :key="index"
      :style="{ width: size + 'px', height: size + 'px' }"
      class="selected-item"
    >
      <img
        :src="item.url"
        :alt="item.alt"
        class="w-full h-full object-contain"
        @click="viewItem(item)"
      />
      <icon
        name="el-icon-close"
        class="remove-button"
        @click="removeItem(item)"
      />
    </div>
    <div
      v-if="!value || value.length < limit"
      :style="{ width: size + 'px', height: size + 'px' }"
      class="
        cursor-pointer
        add-item-button
        inline-flex
        items-center
        justify-center
        border-gray-700 border-dashed border
        clickable
      "
      @click="showDialog"
    >
      <icon name="el-icon-plus" />
    </div>
    <el-dialog
      ref="dialog"
      :visible.sync="isShowDialog"
      title="Chọn hình ảnh, video, file"
      width="90%"
      append-to-body
      :modal-fade="false"
      top="5vh"
      custom-class="media-picker-dialog"
    >
      <el-tabs v-model="activeTab">
        <el-tab-pane
          label="Thư viện"
          class="flex flex-col"
          name="gallery"
          style="max-height: calc(90vh - 200px)"
        >
          <div class="flex">
            <div class="flex-1">
              <el-button
                v-if="selected.length"
                template="delete"
                :text="`Xóa ${selected.length} file`"
                @click="deleteMultipleMedia"
              ></el-button>
            </div>
            <InputSearch
              placeholder="Tìm kiếm"
              size="small"
              class="ml-auto mb-2"
              style="width: auto"
              @search="searchMedia"
            />
          </div>
          <div class="flex">
            <div
              style="padding-right: 10px; height: calc(90vh - 270px)"
              class="border-r overflow-y-auto flex-1"
            >
              <div class="flex flex-wrap mb-auto pt-2 pl-1">
                <div
                  v-for="media in medias"
                  :key="media.id"
                  :style="{ width: '96px', height: '128px' }"
                  class="media-item cursor-pointer mr-2"
                  :class="{
                    'is-selected': selected.find((e) => e.id === media.id),
                  }"
                  @click="selectMedia(media)"
                >
                  <img
                    :src="media.url"
                    :alt="media.alt"
                    style="height: 96px; width: 96px"
                    class="object-contain"
                  />
                </div>
              </div>
            </div>

            <div
              style="
                width: 300px;
                margin-left: 10px;
                height: calc(90vh - 270px);
              "
              class="overflow-y-auto"
            >
              <template v-if="clicked">
                <img
                  :src="clicked.url"
                  :alt="clicked.alt"
                  style="width: 156px; max-height: 200px"
                  class="object-contain mb-2"
                />
                <div class="font-medium">{{ clicked.name }}</div>
                <div class="text-sm">
                  {{ clicked.updatedAt | date('DD/MM/YYYY HH:mm') }}
                </div>
                <el-button type="text" @click="deleteMedia(clicked)">
                  Xóa
                </el-button>
                <el-divider></el-divider>
                Mô tả
                <el-input
                  v-model="clicked.alt"
                  class="w-full mt-2"
                  placeholder="description ..."
                ></el-input>
                <div class="mt-2">
                  Size
                  <InputNumber
                    v-model="width"
                    style="width: 96px"
                    placeholder="width"
                  />
                  x
                  <InputNumber
                    v-model="height"
                    style="width: 96px"
                    placeholder="height"
                  />
                </div>
              </template>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Tải lên" name="upload">
          <input
            v-show="false"
            ref="pickFile"
            type="file"
            multiple
            @change="handleSelectFile"
          />
          <el-button
            template="create"
            text="Chọn file"
            @click="() => $refs.pickFile.click()"
          ></el-button>

          <el-button
            v-if="files.find((e) => e.status === null)"
            template="save"
            text="Tải lên"
            icon="el-icon-upload"
            :disabled="onUpload"
            @click="handleUpload"
          ></el-button>

          <div
            class="flex mt-2 overflow-y-auto flex-col md:flex-row"
            style="height: calc(90vh - 270px)"
          >
            <template v-if="files.length">
              <div class="p-2 md:border-r overflow-y-auto" style="width: 300px">
                <div
                  v-for="(item, index) in files"
                  :key="index"
                  class="
                    shadow
                    rounded-lg
                    px-2
                    py-1
                    cursor-pointer
                    border-transparent border
                    mb-2
                    relative
                  "
                  :class="{ 'border-blue-500': item.file === clickedFile }"
                  @click="clickedFile = item.file"
                >
                  <div class="flex">
                    <img
                      v-if="isImage(item.file)"
                      :src="item.imageUrl || createImageUrl(item.file)"
                      :style="{ width: '40px', height: '40px' }"
                      class="mr-2 object-contain"
                    />
                    <div class="mr-2 flex-1">
                      <div class="font-medium">{{ item.file.name }}</div>
                      <div class="text-xs">
                        {{ item.file.size | number('0.[0] b') }}
                      </div>
                    </div>
                    <el-button
                      template="table_delete"
                      style="margin-top: auto; margin-bottom: auto"
                      @click.native.stop="removeFile(item)"
                    ></el-button>
                  </div>
                  <el-progress
                    v-if="item.status"
                    :status="
                      _.get(
                        {
                          uploading: null,
                          success: 'success',
                          error: 'error',
                        },
                        item.status
                      )
                    "
                    :percentage="item.progress"
                  ></el-progress>
                </div>
              </div>
              <div class="mr-2 flex-1 p-2 pb-2 overflow-y-auto">
                <template v-if="clickedFile">
                  <template v-if="!onCropImage">
                    <div v-if="clickedFileIsImage" class="relative">
                      <img
                        :src="clickedFileUrl"
                        style="
                          width: auto;
                          max-height: 300px;
                          object-fit: cover;
                        "
                      />
                    </div>
                    <div class="mt-2">
                      <el-button
                        icon="el-icon-crop"
                        size="small"
                        type="primary"
                        @click="showCropImage"
                      >
                        crop
                      </el-button>
                    </div>
                    <div class="font-medium">{{ clickedFile.name }}</div>
                    <div class="text-xs">
                      {{ clickedFile.size | number('0.[0] b') }}
                    </div>
                  </template>
                  <template v-else>
                    <vue-cropper
                      ref="cropper"
                      :src="clickedFileUrl"
                      style="max-height: calc(80vh - 250px)"
                    />
                    <div class="flex mt-2">
                      <div class="flex-1">
                        <el-button
                          type="primary"
                          icon-only
                          size="small"
                          icon="flip-x"
                          @click="flipX"
                        ></el-button>
                        <el-button
                          type="primary"
                          icon-only
                          size="small"
                          icon="flip-y"
                          @click="flipY"
                        ></el-button>

                        <el-button
                          type="primary"
                          icon-only
                          size="small"
                          icon="el-icon-refresh-right"
                          @click="rotate"
                        ></el-button>
                      </div>
                      <div>
                        <el-button
                          template="cancel"
                          @click="onCropImage = false"
                        ></el-button>
                        <el-button
                          template="save"
                          icon="el-icon-crop"
                          text="crop"
                          @click="cropImage"
                        ></el-button>
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </template>
            <div v-else>Chọn file để tải lên</div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <template v-if="activeTab === 'gallery'">
        <el-divider></el-divider>
        <div class="w-full flex justify-end">
          <el-button template="cancel" @click="cancel"></el-button>
          <el-button template="save" text="Chọn" @click="confirm"></el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :visible.sync="isShowView"
      :title="_.get(itemForView, 'name')"
      width="80%"
      append-to-body
      custom-class="media-viewer-dialog"
    >
      <template v-if="itemForView">
        <img
          :src="itemForView.url"
          :alt="itemForView.alt"
          class="w-full object-contain"
          style="max-height: 400px"
        />
        <br />
        Mô tả
        <el-input v-model="itemForView.alt" placeholder="Mô tả"></el-input>
      </template>

      <div class="flex justify-end mt-2">
        <el-button template="save" @click="isShowView = false">Ok</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import InputSearch from './Input/InputSearch.vue'
import InputNumber from './Input/InputNumber.vue'
import { Utils } from '~/utils'
import { debounce } from '~/utils/lodash'
import 'cropperjs/dist/cropper.css'

export default {
  name: 'MediaPicker',
  components: { InputSearch, InputNumber, VueCropper },
  props: {
    value: [Object, Array],
    limit: {
      type: Number,
      default: 1,
    },
    size: {
      type: [Number, String],
      default: 48,
    },
  },

  data() {
    return {
      activeTab: 'gallery',
      medias: [],
      isShowDialog: false,
      selected: [],
      clicked: null,
      width: null,
      height: null,
      addSizeToImage: null,
      itemForView: null,
      isShowView: false,
      onUpload: false,
      // upload
      onCropImage: false,
      files: [],
      clickedFile: null,
      scaleX: 1,
      scaleY: 1,
    }
  },

  computed: {
    items() {
      if (this.limit > 1) {
        return this.value || []
      }
      return this.value ? [this.value] : []
    },
    clickedFileIsImage() {
      return !!this.isImage(this.clickedFile)
    },
    clickedFileUrl() {
      return this.clickedFileIsImage
        ? URL.createObjectURL(this.clickedFile)
        : ''
    },
  },

  watch: {
    activeTab() {
      if (this.activeTab === 'upload') {
        this.clickedFile = null
      }
      if (this.activeTab === 'gallery') {
        this.files = this.files.filter((item) => item.status !== 'success')
      }
    },
    clickedFile() {
      this.onCropImage = false
    },
    isShowDialog(state) {
      if (state) {
        this.selected = []
        this.getMedias()
      }
    },
    clicked(clicked) {
      this.width = null
      this.height = null
      if (clicked) {
        const size = new URL(clicked.url).searchParams.get('size')
        const [w, h] = size?.split('x') || []
        this.width = w
        this.height = h
      }
    },
    width() {
      this.addSizeToImage()
    },
    height() {
      this.addSizeToImage()
    },
  },

  created() {
    this.addSizeToImage = debounce(() => {
      if (!this.clicked) return
      if (this.width || this.height) {
        const url = new URL(this.clicked.url)
        url.searchParams.delete('size')
        url.searchParams.append(
          'size',
          `${this.width || ''}x${this.height || ''}`
        )
        this.clicked.url = url.toString()
      } else {
        const url = new URL(this.clicked.url)
        url.searchParams.delete('size')
        this.clicked.url = url.toString()
      }
    }, 500)
  },

  methods: {
    onLoadDialogPicker(ev) {
      console.log('onLoadDialogPicker', ev)
    },

    async getMedias(payload) {
      this.medias = await this.$services.Media.find(this.$axios, {
        query: {},
        ...payload,
        pageSize: 1000,
      })
    },

    removeItem(item) {
      if (this.limit > 1) {
        Utils.removeItems(this.value, (e) => e === item)
      } else {
        this.$emit('input', null)
      }
    },

    showDialog() {
      this.isShowView = false
      this.isShowDialog = true
    },

    closeDialog() {
      this.isShowView = false
      this.isShowDialog = false
    },

    removeFile(item) {
      Utils.removeItems(this.files, (e) => e === item)
      if (this.clickedFile === item.file) this.clickedFile = null
    },

    selectMedia(media) {
      if (this.limit > 1) {
        if (!this.selected.find((e) => e === media)) {
          this.selected.push(media)
          this.clicked = media
        } else {
          Utils.removeItems(this.selected, (e) => e === media)
          this.clicked = null
        }
      } else {
        this.selected = [media]
        this.clicked = media
      }
    },

    confirm() {
      const getItem = (item) => ({
        url: item.url,
        alt: item.alt,
        name: item.name,
      })

      if (this.limit > 1) {
        const value = Array.isArray(this.value) ? this.value : []
        value.push(...this.selected.map(getItem))
        value.splice(this.limit)
        this.$emit('input', value)
      } else {
        this.$emit(
          'input',
          this.selected[0] ? getItem(this.selected[0]) : undefined
        )
      }
      this.isShowDialog = false
    },

    createImageUrl(file) {
      return URL.createObjectURL(file)
    },

    isImage(file) {
      return !!/^image\/*/.test(file.type)
    },

    cancel() {
      this.isShowDialog = false
      this.selected = []
      this.clicked = null
    },

    viewItem(item) {
      this.isShowDialog = false
      this.itemForView = item
      this.isShowView = true
    },

    async deleteMedia(media, showConfirm = true) {
      try {
        const next = showConfirm
          ? await this.$confirm('Bạn có chắc chắn muốn xóa?', {
              type: 'warning',
            })
          : true
        if (next) {
          await this.$services.Media.delete(this.$axios, {
            query: {
              id: media.id,
            },
          })
          Utils.removeItems(this.medias, media, 'id')
          if (this.clicked.id === media.id) this.clicked = null
        }
      } catch (error) {
        console.error(error)
      }
    },

    deleteMultipleMedia() {
      this.$confirm(`Bạn chắc chắn muốn xóa ${this.selected.length} file?`, {
        type: 'warning',
      }).then(() =>
        Promise.all(
          this.selected.map((media) => this.deleteMedia(media, false))
        )
      )
    },

    async searchMedia(text) {
      await this.getMedias({ search: text, exact: true })
      this.selected.forEach((item) => {
        if (!this.medias.find((e) => e.id === item.id)) {
          this.medias.unshift(item)
        }
      })
    },

    handleSelectFile(event) {
      console.log('handleSelectFile', event, this.files)
      event.target.files.forEach((file) => {
        this.files.push({
          file,
          status: null,
          progress: 0,
          url: null,
          response: null,
        })
      })
      event.target.value = null
    },

    async handleUpload() {
      this.onUpload = true
      try {
        const newFiles = await Promise.all(
          this.files.map((item) => {
            if (item.status === 'success') return
            const { file } = item
            item.status = 'uploading'
            return this.$services.Upload.upload(
              this.$axios,
              file,
              (progress) => {
                item.progress = progress
              }
            )
              .then((response) => {
                item.response = response
                item.url = response.url
                item.status = 'success'
                return response
              })
              .catch((err) => {
                console.log('upload error', err)
                item.status = 'error'
              })
          })
        )
        this.medias.unshift(...newFiles)
      } catch (error) {
        console.error(error)
      }
      this.onUpload = false
    },

    showCropImage() {
      this.onCropImage = true
    },

    cropImage() {
      const canvas = this.$refs.cropper.getCroppedCanvas()
      canvas.toBlob((blob) => {
        const index = this.files.findIndex((e) => e.file === this.clickedFile)
        const item = this.files[index]
        const file = new File([blob], this.clickedFile.name, {
          lastModified: new Date().getTime(),
          type: blob.type,
        })
        this.clickedFile = file
        item.file = file
        item.imageUrl = URL.createObjectURL(file)
        this.onCropImage = false
        this.files.splice(index, 1, item)
      }, this.clickedFile.type)
    },

    flipX() {
      this.scaleX = -1 * this.scaleX
      this.$refs.cropper.scaleX(this.scaleX)
    },

    flipY() {
      this.scaleY = -1 * this.scaleY
      this.$refs.cropper.scaleY(this.scaleY)
    },

    rotate() {
      this.$refs.cropper.rotate(90)
    },
  },
}
</script>

<style lang="scss">
.media-picker {
  .selected-item {
    position: relative;
    cursor: pointer;
    display: inline-block;
    @apply bg-white shadow rounded;

    .remove-button {
      cursor: pointer;
      position: absolute;
      right: -4px;
      top: -4px;
      background: #fff;
      color: red;
      border-radius: 8px;
      @apply shadow;
      &:hover {
        transform: scale(1.2, 1.2);
      }
    }
  }

  .selected-item + .selected-item {
    margin-left: 12px;
  }

  .selected-item + .add-item-button {
    margin-left: 12px;
  }

  .selected-item,
  .add-item-button {
    margin-bottom: 12px;
  }
}

.media-picker-dialog {
  max-height: 90vh;
  overflow: hidden;
  .media-item {
    img {
      border-width: 1px;
      @apply border-gray-300;
    }

    &.is-selected img {
      box-shadow: 0px 0px 2px 2px #3182ce;
    }
  }
}
</style>

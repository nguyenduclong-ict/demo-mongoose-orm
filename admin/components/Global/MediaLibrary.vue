<template>
  <el-tabs v-model="activeTab" class="media-library">
    <el-tab-pane label="Thư viện" class="flex flex-col" name="gallery">
      <div class="flex">
        <div class="flex-1">
          <el-button
            v-if="selected.length"
            template="delete"
            :text="`Xóa ${selected.length} file`"
            @click="deleteMultipleMedia"
          ></el-button>

          <el-button
            v-if="selected.length"
            icon="el-icon-close"
            size="small"
            @click="
              selected.splice(0)
              clicked = null
            "
          >
            Bỏ chọn
          </el-button>
        </div>
        <InputSearch
          placeholder="Tìm kiếm"
          size="small"
          class="ml-auto mb-2"
          style="width: auto"
          @search="searchMedia"
        />
      </div>
      <div class="flex flex-1 xc">
        <div
          style="padding-right: 10px"
          class="border-r overflow-y-auto flex-1"
        >
          <div class="flex flex-wrap mb-auto pt-2 pl-1">
            <div
              v-for="media in medias"
              :key="media.id"
              :style="{ width: '96px', height: '128px' }"
              class="media-item cursor-pointer mr-2"
              @click="selectMedia(media)"
            >
              <img
                :src="media.url"
                :alt="media.alt"
                style="height: 96px; width: 96px"
                class="object-contain overflow-hidden"
                :class="{
                  'is-selected': selected.find((e) => e.id === media.id),
                }"
              />
            </div>
          </div>
        </div>

        <div
          style="width: 300px; margin-left: 10px"
          class="overflow-y-auto flex flex-col items-start"
        >
          <template v-if="clicked">
            <template v-if="!showCreateThumnail">
              <el-image
                style="max-height: 200px"
                class="mb-2 flex-none"
                fit="contain"
                :src="clicked.url"
                :alt="clicked.alt"
                :preview-src-list="[clicked.url]"
                :z-index="2050"
              ></el-image>
              <div class="font-medium break-words w-full">
                {{ clicked.name }}
              </div>
              <div class="text-sm flex w-full">
                <span class="flex-1">
                  <icon name="el-icon-date" />
                  {{ clicked.updatedAt | date('DD/MM/YYYY HH:mm') }}
                </span>

                <el-button
                  type="primary"
                  size="mini"
                  @click="deleteMedia(clicked)"
                >
                  Xóa
                </el-button>
              </div>

              <!-- Mô tả
              <el-input
                v-model="clicked.alt"
                class="w-full mt-2"
                placeholder="description ..."
              ></el-input> -->

              <!-- <span class="mt-2">Thumbnail</span> -->
              <div class="list-thumnail flex flex-wrap mt-2">
                <div
                  v-for="(thum, index) in clicked.thumbnails"
                  :key="index"
                  class="relative"
                >
                  <el-image
                    :src="thum.url"
                    style="width: 64px; height: 64px"
                    class="mr-2 bg-gray-200 border-2 border-transparent"
                    fit="cover"
                    :class="{
                      'border-primary': selected.includes(thum),
                    }"
                    @click="selectThumb(thum, clicked)"
                  />
                  <icon
                    name="el-icon-close"
                    class="
                      absolute
                      bg-white
                      rounded-full
                      shadow
                      text-danger
                      cursor-pointer
                    "
                    style="top: -4px; right: 0px"
                    @click="deleteThumbnail(clicked, thum)"
                  />
                </div>

                <div
                  v-if="!showCreateThumnail"
                  class="flex items-center justify-center border cursor-pointer"
                  style="width: 64px; height: 64px"
                  @click="showCreateThumnail = true"
                >
                  <icon name="el-icon-plus"></icon>
                </div>
              </div>
            </template>
            <template v-else>
              <vue-cropper
                ref="cropThumb"
                :src="clicked.url"
                style="width: 100%"
              />
              <div class="w-full flex justify-end mt-2">
                <div class="flex-1">
                  <el-button
                    type="primary"
                    icon-only
                    size="small"
                    icon="flip-x"
                    @click="tflipX"
                  ></el-button>
                  <el-button
                    type="primary"
                    icon-only
                    size="small"
                    icon="flip-y"
                    @click="tflipY"
                  ></el-button>

                  <el-button
                    type="primary"
                    icon-only
                    size="small"
                    icon="el-icon-refresh-right"
                    @click="trotate"
                  ></el-button>
                </div>
                <el-button size="mini" type="primary" @click="addThumbnail">
                  Ok
                </el-button>
                <el-button
                  size="mini"
                  @click="
                    showCreateThumnail = false
                    width = ''
                    height = ''
                  "
                >
                  Cancel
                </el-button>
              </div>
            </template>
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
      <div>
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
      </div>

      <div class="flex mt-2 overflow-y-auto flex-col md:flex-row flex-1">
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
                <div class="mr-2 flex-1 overflow-hidden">
                  <div class="font-medium truncate" style="min-width: 10px">
                    {{ item.file.name }}
                  </div>
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
                    style="width: auto; max-height: 300px; object-fit: cover"
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
                  style="max-height: 300px"
                  :src="clickedFileUrl"
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
        <Empty
          v-else
          text="Chọn file để tải lên"
          class="cursor-pointer"
          icon="el-icon-upload"
          @click="() => $refs.pickFile.click()"
        ></Empty>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import VueCropper from 'vue-cropperjs'
import InputSearch from './Input/InputSearch.vue'
import { Utils } from '~/utils'
import 'cropperjs/dist/cropper.css'
import { removeItems, replace } from '~/utils/utils'

export default {
  name: 'MediaLibrary',
  components: { InputSearch, VueCropper },

  props: {
    limit: { type: Number, default: 1 },
    selected: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      activeTab: 'gallery',
      showCreateThumnail: false,
      medias: [],
      clicked: null,
      width: null,
      height: null,
      onUpload: false,
      // upload
      onCropImage: false,
      files: [],
      clickedFile: null,
      scaleX: 1,
      scaleY: 1,
      tscaleX: 1,
      tscaleY: 1,
      description: '',
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
    activeTab: {
      handler() {
        if (this.activeTab === 'upload') {
          this.clickedFile = null
        }
        if (this.activeTab === 'gallery') {
          this.files = this.files.filter((item) => item.status !== 'success')
        }
        this.$emit('change-tab', this.activeTab)
      },
      immediate: true,
    },
    clickedFile() {
      this.onCropImage = false
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
  },

  created() {
    this.getMedias()
  },

  methods: {
    selectThumb(thum, media) {
      removeItems(this.selected, media)
      if (this.selected.length >= this.limit) {
        this.selected.pop()
      }

      if (this.selected.includes(thum)) {
        this.selected.splice(this.selected.indexOf(thum), 1)
      } else {
        this.selected.push(thum)
      }
    },
    addThumbnail() {
      const canvas = this.$refs.cropThumb.getCroppedCanvas()
      canvas.toBlob(async (blob) => {
        const file = new File([blob], 'thumbnail.jpeg', {
          lastModified: new Date().getTime(),
          type: blob.type,
        })
        const formData = new FormData()
        formData.append('file', file)
        formData.append('width', canvas.width)
        formData.append('height', canvas.height)

        const res = await this.$axios.$post(
          '/media/thumbnail/' + this.clicked.id,
          formData
        )

        replace(this.medias, res, 'id')
        this.clicked = res
        this.showCreateThumnail = false
        this.width = ''
        this.height = ''
      }, 'image/jpeg')
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
          Utils.removeItems(this.selected, (e) => media.thumbnails.includes(e))
          this.clicked = null
        }
      } else {
        this.selected.splice(0)
        this.selected.push(media)
        this.clicked = media
      }
      this.showCreateThumnail = false
      this.width = ''
      this.height = ''
    },

    createImageUrl(file) {
      return URL.createObjectURL(file)
    },

    isImage(file) {
      return !!/^image\/*/.test(file.type)
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
          this.selected
            .filter((e) => e.type)
            .map((media) => this.deleteMedia(media, false))
        )
      )
    },

    async deleteThumbnail(media, thumbnail, showConfirm = true) {
      console.log(media, thumbnail)
      try {
        const next = showConfirm
          ? await this.$confirm('Bạn có chắc chắn muốn xóa?', {
              type: 'warning',
            })
          : true
        if (next) {
          await this.$axios.$delete(
            '/media/thumbnail/' + media.id + '/' + thumbnail.id
          )
          removeItems(media.thumbnails, thumbnail, ['id'])
          removeItems(this.selected, thumbnail, ['id'])
          replace(this.medias, media, 'id')
        }
      } catch (error) {
        console.error(error)
      }
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

    tflipX() {
      this.tscaleX = -1 * this.tscaleX
      this.$refs.cropThumb.scaleX(this.tscaleX)
    },

    tflipY() {
      this.tscaleY = -1 * this.tscaleY
      this.$refs.cropThumb.scaleY(this.tscaleY)
    },

    trotate() {
      this.$refs.cropThumb.rotate(90)
    },
  },
}
</script>

<style lang="scss">
.media-library {
  overflow: hidden;
  .media-item {
    img {
      border-width: 2px;
    }

    img.is-selected {
      @apply border-primary;
    }
  }
}
</style>

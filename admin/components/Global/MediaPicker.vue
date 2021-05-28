<template>
  <div class="media-picker inline-flex flex-wrap w-full">
    <div
      v-for="(item, index) in items"
      :key="index"
      :style="{ width: size + 'px', height: size + 'px' }"
      class="selected-item"
    >
      <img
        :src="type === 'object' ? item.url : item"
        :alt="type === 'object' && item.alt"
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
      <MediaLibrary
        ref="mediaLibrary"
        :selected="selected"
        :limit="limit"
        @change-tab="handleChangeTab"
      />

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
          :src="type === 'object' ? itemForView.url : itemForView"
          :alt="type === 'object' && itemForView.alt"
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
import MediaLibrary from './MediaLibrary.vue'
import { Utils } from '~/utils'

export default {
  name: 'MediaPicker',
  components: { MediaLibrary },
  props: {
    value: [Object, Array, String],
    limit: {
      type: Number,
      default: 1,
    },
    size: {
      type: [Number, String],
      default: 48,
    },
    // 'string' | 'object'
    type: {
      type: String,
      default: 'string',
    },
  },

  data() {
    return {
      isShowDialog: false,
      itemForView: null,
      isShowView: false,
      selected: [],
      activeTab: null,
    }
  },

  computed: {
    items() {
      if (this.limit > 1) {
        return this.value || []
      }
      return this.value ? [this.value] : []
    },
  },

  watch: {
    clickedFile() {
      this.onCropImage = false
    },
    isShowDialog(state) {
      if (state) {
        this.selected = []
        if (this.$refs.mediaLibrary) {
          this.$refs.mediaLibrary.clicked = null
        }
      }
    },
  },

  methods: {
    handleChangeTab(tab) {
      console.log(tab)
      this.activeTab = tab
    },

    handleSelect(data) {
      this.selected = data
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

    confirm() {
      const getItem = (item) =>
        this.type === 'string'
          ? item.url
          : {
              url: item.url,
              alt: item.alt,
              name: item.name,
            }

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
  #pane-gallery {
    height: calc(90vh - 230px);
    overflow: hidden;

    .xc {
      height: calc(90vh - 270px);
    }
  }

  #pane-upload {
    height: calc(90vh - 138px);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
}
</style>

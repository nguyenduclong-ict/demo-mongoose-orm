<template>
  <div
    class="app-editor"
    :style="{
      '--toolbar-size': { small: '24px', normal: '34px' }[toolbarSize],
    }"
  >
    <editor
      v-if="active"
      v-model="_value"
      :init-value="value"
      :init="init"
      :disabled="disabled"
    />

    <MediaPicker
      v-show="false"
      ref="mediaPicker"
      v-model="selectedImage"
      :limit="100"
      @input="handleInsertImage"
    />
  </div>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import MediaPicker from './MediaPicker.vue'

export default {
  name: 'TinymceEditor',
  components: {
    editor: Editor,
    MediaPicker,
  },

  props: {
    value: String,
    toolbarSize: {
      validator: (v) => v === 'small' || v === 'normal',
      default: 'normal',
    },
    placeholder: String,
    options: {
      type: Object,
      default: () => ({}),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selectedImage: [],
      init: {
        max_height: 600,
        menubar: false,
        toolbar_mode: 'sliding',
        plugins: [
          'advlist autolink lists link image charmap print preview anchor media advcode',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table paste code wordcount a11ychecker tabfocus',
        ],
        toolbar: [
          'fullscreen preview formatselect fontselect bold italic forecolor backcolor',
          'alignleft aligncenter alignright alignjustify',
          'table bullist numlist outdent indent removeformat image mediapicker media undo redo code',
        ]
          .join(' ')
          .split(' ')
          .join('|'),
        font_formats:
          'Andale Mono=andale mono,times; Arial=arial,helvetica,sans-serif; Arial Black=arial black,avant garde; Book Antiqua=book antiqua,palatino; Comic Sans MS=comic sans ms,sans-serif; Courier New=courier new,courier; Georgia=georgia,palatino; Helvetica=helvetica; Impact=impact,chicago; Symbol=symbol; Tahoma=tahoma,arial,helvetica,sans-serif; Terminal=terminal,monaco; Times New Roman=times new roman,times; Trebuchet MS=trebuchet ms,geneva; Verdana=verdana,geneva; Webdings=webdings; Wingdings=wingdings,zapf dingbats',
        paste_preprocess(plugin, data) {
          console.log(plugin, data.content)
          if (data.content) {
            if (data.content.startsWith('https://youtu.be')) {
              const embedUrl = data.content.replace(
                'https://youtu.be',
                'https://www.youtube.com/embed'
              )
              data.content = `<iframe width="560" height="315" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
              return
            }
            if (data.content.startsWith('https://www.youtube.com/watch')) {
              const videoId = new URL(data.content).searchParams.get('v')
              const embedUrl = `https://www.youtube.com/embed/${videoId}`
              data.content = `<iframe width="560" height="315" src="${embedUrl}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
              return
            }
            if (
              data.content.startsWith('https:') ||
              data.content.startsWith('http:')
            ) {
              data.content = `<a href="${data.content}">${data.content}</a>`
            }
          }
        },
        lists_indent_on_tab: true,
        content_css: '/css/tinymce.css',
        // Image
        images_upload_handler: this.imageUploadHandler,
        image_caption: true,
        image_advtab: true,
        a11y_advanced_options: true,
        resize_img_proportional: false,
        paste_data_images: true,
        image_dimensions: false,
        automatic_uploads: true,
        file_picker_callback: this.filePickerHandler,
        image_class_list: [
          { title: 'Width: 100%', value: 'image__w-full' },
          { title: 'Width: 50%', value: 'image__w-50pt' },
          { title: 'Width: auto', value: 'image__w-auto' },
        ],
        setup: (editor) => {
          this.$emit('setup', editor)
          this.editor = editor
          editor.on('ObjectResized', this.handleImageResized)
          editor.on('keydown', this.handleEditorKeydown)
          editor.ui.registry.addButton('mediapicker', {
            text: '',
            icon: 'image',
            onAction: () => {
              this.$refs.mediaPicker.showDialog()
            },
          })
        },
        init_instance_callback: (editor) => {
          this.$emit('init-instance', editor)
          editor.dom.doc.addEventListener(
            'dblclick',
            this.handleEditorContainerDblclick
          )
        },
        placeholder: this.placeholder,
        branding: false,
        elementpath: false,
        statusbar: true,
        resize: true,
        ...this.options,
      },
      editor: null,
      previewKeyDown: null,
      active: true,
    }
  },

  computed: {
    _value: {
      get() {
        return this.value
      },
      set(v) {
        return this.$emit('input', v)
      },
    },
  },

  methods: {
    imageUploadHandler(blobInfo, success, failure, progress) {
      const uploadService = this.$services.Media
      const onError = (error) => failure(error.message)
      uploadService
        .upload(this.$axios, blobInfo.blob(), progress, onError)
        .then((fileResponses) => {
          success(fileResponses[0].url)
        })
    },

    handleImageResized(e) {
      e.target.classList.value = e.target.classList.value.replace(
        /(^| )image__w-\w*/g,
        ''
      )
      e.target.classList.add('resized')
    },

    handleEditorContainerDblclick(e) {
      if (e.target.tagName === 'IMG') {
        window.open(e.target.getAttribute('src'), '_blank')
      }
    },

    handleEditorKeydown(e) {
      if (e.code === 'Tab' && this.previewKeyDown === 'Minus') {
        // this.editor.execCommand('InsertDefinitionList', false)
        // this.editor.execCommand('InsertDefinitionList', false)
        e.preventDefault()
        this.$nextTick(() => {
          this.editor.execCommand('Delete')
          this.editor.execCommand('InsertOrderedList', false, {
            'list-style-type': 'decimal',
          })
        })
      } else if (e.code === 'Tab' && this.previewKeyDown === 'Period') {
        e.preventDefault()
        this.$nextTick(() => {
          this.editor.execCommand('Delete')
          this.editor.execCommand('InsertUnorderedList', true, {
            'list-style-type': 'disc',
          })
        })
      }
      this.previewKeyDown = e.code
    },

    reload() {
      this.active = false
      this.$nextTick(() => {
        this.active = true
      })
    },

    handleInsertImage(value) {
      const arr = !Array.isArray(value) ? [value] : value
      arr.forEach((v) =>
        this.editor.insertContent(
          `<img src="${v.url}" alt="${v.alt}" title="${v.title}" />`
        )
      )
      this.$nextTick(() => {
        this.selectedImage = []
        this.$refs.mediaPicker.closeDialog()
      })
    },
  },
}
</script>

<style lang="scss">
.tox-notifications-container {
  display: none;
}
.app-editor {
  display: inline-block;
  .tox-toolbar__primary {
    background: #fff !important;
    border-bottom: solid 1px #ccc !important;

    .tox-tbtn {
      height: var(--toolbar-size);
    }
  }
}
</style>

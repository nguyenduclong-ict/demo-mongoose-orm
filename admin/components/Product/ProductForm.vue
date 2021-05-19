<template>
  <el-form :model="form" :rules="rules">
    <el-row :gutter="12">
      <el-col :sm="12">
        <el-form-item label="Tên sản phẩm" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>

        <el-form-item label="Mã sản phẩm" prop="sku">
          <el-input v-model="form.sku"></el-input>
        </el-form-item>

        <el-form-item label="Đường đẫn tĩnh" prop="slug">
          <el-input v-model="form.slug"></el-input>
        </el-form-item>

        <el-form-item label="Từ khóa">
          <el-select
            v-model="form.keywords"
            multiple
            class="w-full"
            allow-create
            filterable
            default-first-option
          ></el-select>
        </el-form-item>

        <el-row :gutter="12">
          <el-col>
            <el-form-item label="Giá bán" prop="price">
              <InputNumber v-model="form.price"></InputNumber>
            </el-form-item>
          </el-col>
          <!-- <el-col :sm="8">
            <el-form-item label="Giá nhập">
              <InputNumber v-model="form.importPrice"></InputNumber>
            </el-form-item>
          </el-col>
          <el-col :sm="8">
            <el-form-item label="Giá xuất">
              <InputNumber v-model="form.exportPrice"></InputNumber>
            </el-form-item>
          </el-col> -->
        </el-row>

        <el-form-item label="Danh mục">
          <SelectEntity
            v-model="form.categories"
            class="w-full"
            v-bind="selectCategoriesConfig"
          />
        </el-form-item>

        <el-form-item label="Chính sách bảo hành">
          <SelectEntity
            v-model="form.warrantyPolicy"
            class="w-full"
            v-bind="selWP"
          />
        </el-form-item>

        <el-form-item label="Tags">
          <SelectEntity
            v-model="form.tags"
            class="w-full"
            v-bind="selectTagConfig"
          />
        </el-form-item>

        <el-form-item label="Hiển thị với khách hàng">
          <el-switch v-model="form.isPublished" />
        </el-form-item>

        <el-form-item label="Ẩn hết hàng">
          <el-switch v-model="form.hideOutOfStock" />
        </el-form-item>

        <el-collapse :value="form.onSale ? 'sale_setting' : undefined">
          <el-collapse-item :disabled="!form.onSale" name="sale_setting">
            <template slot="title">
              <el-checkbox v-model="form.onSale">Giảm giá</el-checkbox>
            </template>
            <el-form-item label="Tiền giảm giá">
              <InputNumber
                v-model="form.salePrice"
                suffix-icon="el-icon-money"
              />
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <div class="flex justify-between my-2">
          <el-checkbox v-if="!form.id" v-model="form.hasVariation">
            Sản phẩm có nhiều phiên bản
          </el-checkbox>
          <div v-else-if="form.hasVariation">Sản phẩm có nhiều phiên bản</div>

          <el-popover
            v-if="form.hasVariation"
            ref="ppvVariant"
            title="Thêm phiên bản cho SP"
            trigger="click"
          >
            <el-button slot="reference" template="create">
              Thêm phiên bản
            </el-button>

            <div class="flex">
              <el-select
                v-model="createVariantForm.attribute_id"
                size="small"
                @change="cvfSelectAttr"
              >
                <el-option
                  v-for="(item, index) in attrOptions"
                  :key="index"
                  :label="_.get(item, 'data.name')"
                  :value="item.attribute"
                ></el-option>
              </el-select>

              <el-select
                v-model="createVariantForm.attribute_value"
                size="small"
                class="ml-2"
              >
                <template v-if="createVariantForm.values">
                  <el-option
                    v-for="v in createVariantForm.values"
                    :key="v"
                    :label="v"
                    :value="v"
                  ></el-option>
                </template>
              </el-select>

              <span class="ml-2 mb-auto">
                <el-button
                  size="small"
                  template="create"
                  icon-only
                  @click="cvfAddAttToVariation"
                ></el-button>
              </span>
            </div>

            <DataTable
              :data="createVariantForm.items"
              :options="{}"
              :columns="[
                { label: 'Thuộc tính', prop: 'attribute.name' },
                { label: 'Giá trị', prop: 'value' },
                {
                  type: 'controls',
                  controls: ['delete'],
                  label: '-',
                  events: {
                    delete: {
                      click: cvfDClick,
                    },
                  },
                },
              ]"
            ></DataTable>

            <div class="w-full flex justify-end mt-2">
              <span
                v-if="variantFormValidate.message"
                class="flex-1 text-danger"
              >
                * {{ variantFormValidate.message }}
              </span>
              <el-button
                template="save"
                :disabled="!variantFormValidate.valid"
                @click="handleAddattributes"
              ></el-button>
            </div>
          </el-popover>
        </div>

        <template v-if="form.hasVariation">
          <div v-if="form.hasVariation" class="w-full">Các thuộc tính</div>
          <div class="mb-4">
            <div
              v-for="(item, index) in form.attributes"
              :key="index"
              class="flex mb-2"
            >
              <SelectEntity
                ref="attr"
                :key="index"
                v-model="item.attribute"
                v-bind="selAttr(item)"
                @input="onSelAttr(item, index)"
              />
              <el-select
                v-model="item.values"
                placeholder="Thêm các giá trị cho thuộc tính"
                filterable
                multiple
                allow-create
                default-first-option
                size="small"
                class="flex-1 ml-2"
              >
                <template v-if="item.data">
                  <el-option
                    v-for="v in item.data.values"
                    :key="v"
                    :value="v"
                    :label="v"
                  ></el-option>
                </template>
              </el-select>
              <div class="ml-2">
                <el-button
                  icon-only
                  template="delete"
                  @click="delAttr(item)"
                ></el-button>
              </div>
            </div>
          </div>
          <el-button
            template="create"
            @click="form.attributes.push({ attribute: null, values: [] })"
          >
            Thêm thuộc tính
          </el-button>
        </template>

        <DataTable
          v-if="form.hasVariation"
          class="w-full"
          :data="form.variations"
          :options="{}"
          :columns="[
            { label: 'Tên', prop: 'name' },
            { label: 'Giá', prop: 'price', type: 'slot' },
            { label: 'Giảm giá', prop: 'salePrice', type: 'slot' },
            { label: '-', type: 'controls', controls: ['delete'] },
          ]"
        >
          <el-table-column slot="column-price" label="Giá">
            <template #default="{ row }">
              <InputNumber v-model="row.price" size="small"></InputNumber>
            </template>
          </el-table-column>

          <el-table-column slot="column-salePrice" label="Giảm giá">
            <template #default="{ row }">
              <InputNumber v-model="row.salePrice" size="small"></InputNumber>
            </template>
          </el-table-column>
        </DataTable>
      </el-col>

      <el-col :sm="12">
        <el-form-item label="Hình ảnh">
          <div class="flex w-full flex-col md:flex-row">
            <el-form-item prop="image">
              <MediaPicker
                v-model="form.image"
                :size="128"
                style="width: auto"
              />
            </el-form-item>
            <div class="flex-1 ml-0 mt-3 md:ml-3 md:mt-0">
              <MediaPicker v-model="form.images" :limit="10" />
            </div>
          </div>
        </el-form-item>

        <el-form-item label="Mô tả ngắn">
          <TinymceEditor v-model="form.shortDescription" class="w-full" />
        </el-form-item>
        <el-form-item label="Mô tả">
          <TinymceEditor v-model="form.description" class="w-full" />
        </el-form-item>
      </el-col>

      <el-col :span="24" class="mt-4">
        <slot name="button">
          <el-button template="save" @click="$emit('save')"></el-button>
        </slot>
      </el-col>
    </el-row>
  </el-form>
</template>

<script>
import slugify from 'slugify'
import SelectEntity from '~/components/Global/Select/SelectEntity.vue'
import { PRODUCT_TAG, SALE_TYPE } from '~/config/constants/product'
import * as _ from '~/utils/lodash'
import { getObjectId, removeItems } from '~/utils/utils'
import { Utils } from '~/utils'
export default {
  components: { SelectEntity },
  props: {
    form: {
      type: Object,
    },
  },

  data() {
    return {
      onFetchAttr: false,
      rules: {
        name: {
          required: true,
          message: 'Vui lòng nhập tên',
        },
        sku: {
          required: true,
          message: 'Vui lòng nhập tên',
        },
        slug: {
          required: true,
          message: 'Vui lòng nhập đường dẫn tĩnh',
        },
        price: {
          required: true,
          message: 'Vui lòng nhập giá sản phẩm',
        },
        image: {
          required: true,
          message: 'Vui lòng chọn hình ảnh sản phẩm',
        },
      },
      attribute: {
        attribute: null,
        data: null,
        values: [],
      },
      selWP: {
        service: this.$services.WarrantyPolicy,
        selectProps: {
          placeholder: 'Chọn chính sách bảo hành',
        },
      },
      selectCategoriesConfig: this.$initSelectEntity({
        service: this.$services.ProductCategory,
        limit: Number.MAX_SAFE_INTEGER,
      }),
      selectTagConfig: this.$initSelectEntity({
        selectProps: {
          placeholder: 'Chọn tags',
        },
        limit: Number.MAX_SAFE_INTEGER,
        defaultOptions: [
          { id: PRODUCT_TAG.NEW, name: 'Hàng mới về' },
          { id: PRODUCT_TAG.NEW_SEAL, name: 'Hàng nguyên team' },
          { id: PRODUCT_TAG.SECONDHAND, name: 'Hàng đã qua sử dụng' },
        ],
      }),
      selectSaleTypeConfig: this.$initSelectEntity({
        selectProps: {
          placeholder: 'Chọn kiểu giảm giá',
        },
        defaultOptions: [
          { id: SALE_TYPE.ABSOLUTE, name: 'Giảm giá trực tiếp' },
          { id: SALE_TYPE.PERCENT, name: 'Giảm giá theo phần trăm' },
        ],
      }),

      selectAttributeConfig: this.$initSelectEntity({
        service: this.$services.ProductAttribute,
        selectProps: { size: 'small', placeholder: 'Chọn thuộc tính' },
        filterDataMethod: (data) =>
          data.filter(
            (item) =>
              this.form.attributes.find((attr) => attr.attribute === item.id) &&
              !this.createVariantForm.items.find(
                (e) => e.attribute.id === item.id
              )
          ),
      }),

      createVariantForm: {
        attrubute_id: null,
        attribute_value: '',
        values: [],
        items: [],
      },
    }
  },

  computed: {
    attrOptions() {
      if (this.onFetchAttr) {
        return []
      }
      return this.form.attributes.filter((item) => {
        return !this.createVariantForm.items.find(
          (e) => getObjectId(e.attribute) === getObjectId(item.attribute)
        )
      })
    },

    variantFormValidate() {
      if (!this.createVariantForm.items.length) {
        return {
          valid: false,
        }
      }
      if (
        this.form.variations.find((child) =>
          child.attributes.every((item) =>
            this.createVariantForm.items.find((e) => {
              return (
                getObjectId(e.attribute) === getObjectId(item.attribute) &&
                e.value === item.value
              )
            })
          )
        )
      ) {
        return {
          valid: false,
          message: 'Phiên bản đã tồn tại',
        }
      }

      return {
        valid: true,
      }
    },
  },

  watch: {
    'form.name'() {
      this.form.variations.forEach((child) => {
        child.name = this.generateChildrenName(child.attributes)
      })
      this.form.slug = slugify(this.form.name, { lower: true, locale: 'vi' })
    },

    'attribute.id'(id) {
      this.attribute.data = this.$refs.attr.data.find((item) => item.id === id)
    },

    'form.attributes': {
      handler() {
        this.onFetchAttr = true
        this.$api.ProductAttribute.find({
          query: {
            id: {
              $in: this.form.attributes.map((item) =>
                getObjectId(item.attribute)
              ),
            },
          },
        })
          .then((attributes) => {
            this.form.attributes.forEach((item) => {
              item.data = attributes.find(
                (e) => e.id === getObjectId(item.attribute)
              )
            })
            this.onFetchAttr = false
          })
          .catch(() => {
            this.onFetchAttr = false
          })
      },
      immediate: true,
    },
  },

  methods: {
    onSelAttr(item, index) {
      if (item.attribute) {
        const sel = Array.isArray(this.$refs.attr)
          ? this.$refs.attr.find((e) => e.$vnode.key === index)
          : this.$refs.attr
        console.log(sel)
        if (sel) {
          item.data = sel.data.find((e) => e.id === item.attribute)
          console.log(item.data)
        }
      } else {
        item.data = null
      }
    },
    delAttr(item) {
      removeItems(this.form.attributes, (e) => e === item)
    },
    selAttr(item) {
      return this.$initSelectEntity({
        service: this.$services.ProductAttribute,
        selectProps: { size: 'small', placeholder: 'Chọn thuộc tính' },
        filterDataMethod: (data) =>
          data.filter((attr) => {
            return (
              attr.id === item.attribute ||
              !this.form.attributes.find((e) => e.attribute === attr.id)
            )
          }),
      })
    },
    addAttribute() {
      if (!this.attribute) return
      this.form.attributes.push({
        attribute: this.attribute.attribute,
        values: this.attribute.values,
      })
      this.attribute = {
        attribute: null,
        data: null,
        values: [],
      }
    },

    handleAddattributes() {
      this.form.variations.push({
        ..._.pick(this.form, 'price', 'importPrice', 'exportPrice'),
        name: this.generateChildrenName(this.createVariantForm.items),
        attributes: [...this.createVariantForm.items],
        salePrice: 0,
        image: '',
      })
      this.createVariantForm.attrubute_id = null
      this.createVariantForm.attribute_value = null
      this.createVariantForm.items.splice(0)
      this.$refs.ppvVariant.doClose()
    },

    generateChildrenName(attributes) {
      return attributes.map((item) => item.value).join(', ')
    },

    // CREATE VARIATION FORM
    cvfSelectAttr(value) {
      const item = this.form.attributes.find((e) => e.attribute === value)
      this.createVariantForm.data = item.data
      this.createVariantForm.values = item?.values
    },

    cvfAddAttToVariation() {
      if (!this.createVariantForm.attribute_id) return
      if (!this.createVariantForm.attribute_value) return
      this.createVariantForm.items.push({
        attribute: this.createVariantForm.data,
        value: this.createVariantForm.attribute_value,
      })
      this.createVariantForm.attribute_id = null
      this.createVariantForm.attribute_value = null
      this.createVariantForm.data = null
      this.createVariantForm.values = []
    },

    cvfDClick({ context, row }) {
      Utils.removeItems(context.data, (e) => e === row)
    },
  },
}
</script>

<style></style>

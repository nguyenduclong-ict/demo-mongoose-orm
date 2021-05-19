<template>
  <el-row :gutter="12">
    <el-col :md="12">
      <el-form-item v-if="fields.includes('provice')" label="Tỉnh/Thành phố">
        <SelectEntity
          v-model="editValue.provinceCode"
          v-bind="_selectProvinceConfig"
          class="w-full"
          @change="handleChangeProvince"
        />
      </el-form-item>
    </el-col>
    <el-col :md="12">
      <el-form-item v-if="fields.includes('district')" label="Quyện/Huyện">
        <SelectEntity
          ref="selectDistrict"
          v-model="editValue.districtCode"
          v-bind="_selectDistrictConfig"
          :select-props="_selectDistrictConfig.selectProps"
          class="w-full"
          @change="handleChangeDistrict"
        />
      </el-form-item>
    </el-col>
    <el-col :md="12">
      <el-form-item v-if="fields.includes('ward')" label="Xã/Phường">
        <SelectEntity
          ref="selectWard"
          v-model="editValue.wardCode"
          v-bind="_selectWardConfig"
          class="w-full"
          @change="handleChangeWard"
        />
      </el-form-item>
    </el-col>
    <el-col>
      <el-form-item v-if="fields.includes('street')" label="Địa chỉ">
        <el-input v-model="editValue.street" type="textarea"></el-input>
      </el-form-item>
    </el-col>
    <el-col :md="12">
      <el-form-item
        v-if="fields.includes('name')"
        label="Tên"
        :prop="props.name"
      >
        <el-input v-model="editValue.name"></el-input>
      </el-form-item>
    </el-col>
    <el-col :md="12">
      <el-form-item
        v-if="fields.includes('phone')"
        label="Số điện thoại"
        :prop="props.phone"
      >
        <el-input v-model="editValue.phone"></el-input>
      </el-form-item>
    </el-col>
    <el-col>
      <el-checkbox
        v-if="fields.includes('primary')"
        v-model="editValue.isPrimary"
        label="Đặt làm mặc định"
      ></el-checkbox>
    </el-col>
  </el-row>
</template>

<script>
import SelectEntity from '../Select/SelectEntity.vue'
import { Lodash } from '~/utils'

export default {
  components: {
    SelectEntity,
  },

  props: {
    value: {
      type: Object,
      default: () => ({
        provinceCode: null,
        districtCode: null,
        wardCode: null,
        street: '',
        text: '',
        isPrimary: false,
      }),
    },

    fields: {
      type: Array,
      default: () => [
        'provice',
        'district',
        'ward',
        'street',
        'name',
        'phone',
        'primary',
      ],
    },

    props: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      editValue: {
        provinceCode: null,
        districtCode: null,
        wardCode: null,
        street: '',
        text: '',
        isPrimary: false,
      },
      selectProvinceConfig: {
        service: this.$services.Location,
        valueKey: 'code',
        payload: {
          search: '',
          pageSize: 100,
        },
        selectProps: {
          clearable: true,
          placeholder: 'Chọn tỉnh, thành phố',
        },
      },
      selectDistrictConfig: {
        service: this.$services.Location,
        valueKey: 'code',
        payload: {
          search: '',
          pageSize: 100,
          query: {
            provinceCode: undefined,
          },
        },
        selectProps: {
          clearable: true,
          placeholder: 'Chọn quận, huyện',
          disabled: false,
        },
      },
      selectWardConfig: {
        service: this.$services.Location,
        valueKey: 'code',
        payload: {
          search: '',
          pageSize: 100,
          query: {
            districtCode: undefined,
          },
        },
        selectProps: {
          clearable: true,
          placeholder: 'Chọn phường, xã',
          disabled: false,
        },
      },
    }
  },

  computed: {
    _selectProvinceConfig() {
      return Lodash.merge(this.selectProvinceConfig, {
        payload: {
          query: {
            type: 'province',
          },
        },
        selectProps: {
          placeholder: 'Chọn tỉnh, thành phố',
        },
      })
    },
    _selectDistrictConfig() {
      return Lodash.merge(this.selectDistrictConfig, {
        payload: {
          query: {
            type: 'district',
            provinceCode: this.editValue.provinceCode,
          },
        },
        selectProps: {
          disabled: !this.editValue.provinceCode,
        },
      })
    },
    _selectWardConfig() {
      return Lodash.merge(this.selectWardConfig, {
        payload: {
          query: {
            type: 'ward',
            districtCode: this.editValue.districtCode,
          },
        },
        selectProps: {
          disabled:
            !this.editValue.provinceCode || !this.editValue.districtCode,
        },
      })
    },
  },

  created() {
    if (!this.value) {
      this.$emit('input', this.editValue)
    } else {
      this.editValue = this.value
    }
  },

  methods: {
    handleChangeProvince() {
      console.log('handleChangeProvince')
      this.editValue.districtCode = null
      this.editValue.wardCode = null
      this.$emit('input', this.editValue)
      this.$nextTick(() => {
        this.$refs.selectDistrict?.fetchData()
      })
    },
    handleChangeDistrict() {
      this.editValue.wardCode = null
      this.$emit('input', this.editValue)
      this.$nextTick(() => {
        this.$refs.selectWard?.fetchData()
      })
    },
    handleChangeWard() {
      this.$emit('input', this.editValue)
    },
  },
}
</script>

<style></style>

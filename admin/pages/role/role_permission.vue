<template>
  <div class="permission-page">
    <div class="flex justify-end mb-2">
      <el-button template="save" @click="handleSave" />
    </div>
    <el-tabs type="border-card" value="entity">
      <el-tab-pane label="Entity" name="entity">
        <el-collapse>
          <el-collapse-item
            v-for="entity in entities"
            :key="entity.key"
            :name="entity.key"
          >
            <template slot="title">
              {{ entity.name }}
              <template v-for="p in entity.permissions">
                <el-tag
                  v-if="p.status"
                  :key="p.action"
                  :type="getTagType(p.action)"
                  size="mini"
                  class="ml-2"
                >
                  {{ p.action }}
                </el-tag>
              </template>
            </template>
            <div>
              <el-checkbox
                :value="isAllEntityPermission(entity)"
                :indeterminate="isIndeterminateEntity(entity)"
                @change="checkAllEntityPermission(entity, $event)"
              >
                All
              </el-checkbox>
            </div>

            <div>
              <div
                v-for="action in allActions"
                :key="action"
                class="inline-flex items-center px-4 first:pl-0 border-r last:border-r-0"
              >
                <el-checkbox
                  :value="isHasEntityPermission(entity, action)"
                  @change="changeEntityPermission(entity, action, $event)"
                >
                  {{ action }}
                </el-checkbox>
                <el-switch
                  v-if="isHasEntityPermission(entity, action)"
                  class="ml-2"
                  active-text="Only Self"
                  :value="isOnlySelf(entity, action)"
                  @change="handleChangeOnlySelf(entity, action, $event)"
                ></el-switch>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="Api" name="api">
        <el-collapse>
          <el-collapse-item v-for="(arr, key) in apis" :key="key" :title="key">
            <div class="flex flex-wrap">
              <el-checkbox
                v-for="api in arr"
                :key="api.method + ' ' + api.path"
                class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4"
                style="margin-right: 0"
                :label="api.method + ' ' + api.path"
                :value="isHasApiPermission(api)"
                @change="changeApiPermission(api, $event)"
              ></el-checkbox>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-tab-pane>
      <el-tab-pane label="Page" name="page">
        <div class="flex flex-wrap">
          <div
            v-for="page in pages"
            :key="page.name"
            class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
          >
            <el-checkbox
              style="margin-right: 0"
              class="border rounded page-item p-2"
              :value="isHasPagePermission(page)"
              @change="changePagePermission(page, $event)"
            >
              <div>
                {{ page.name }}
              </div>
              <div class="text-xs italic">
                {{ _.get(page, 'meta.title') }}
              </div>
            </el-checkbox>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { routes } from '~/config/router'
import { Utils } from '~/utils'
import { cloneDeep } from '~/utils/lodash'
import PageMixin from '~/utils/mixin/page.mixin'
import { getObjectId } from '~/utils/utils'
const allActions = ['read', 'create', 'update', 'delete']
export default {
  mixins: [PageMixin],

  async asyncData({ $api, $axios, params, store, error }) {
    const { schemas } = store.state
    let permissions
    let role
    const entities = {}

    if (params.code === 'authenticated') {
      role = {
        code: 'authenticated',
        name: 'Người dùng đã đăng nhập',
      }
      permissions = await $api.Permission.find({
        query: {
          isAuthenticated: true,
        },
      })
    } else if (params.code === 'anonymous') {
      role = {
        code: 'anonymous',
        name: 'Người dùng chưa đăng nhập',
      }
      permissions = await $api.Permission.find({
        query: {
          isAnonymous: true,
        },
      })
    } else {
      role = await $api.Role.findOne({
        query: {
          code: params.code,
        },
      })
      if (!role) {
        return error({ statusCode: 404, message: 'Không tìm thấy vai trò' })
      }
      permissions = await $api.Permission.find({
        query: {
          role: getObjectId(role),
        },
      })
    }

    // Entities
    Object.keys(schemas).forEach((key) => {
      entities[key] = cloneDeep(schemas[key])
      entities[key].permissions = permissions.filter(
        (item) => item.entityType === 'entity' && item.entity === key
      )
    })

    // API
    const serverApis = await $axios.$get('/admin/apis')
    const apis = {}
    const apiPermissions = []
    serverApis.forEach((api) => {
      apis[api.group] = apis[api.group] || []
      apis[api.group].push(api)
      const permission = permissions.find(
        (item) =>
          item.entityType === 'api' &&
          item.path === api.endpoint &&
          item.method === api.method
      )
      if (permission) {
        apiPermissions.push(permission)
      }
    })

    // PAGES
    const pages = []

    const getFlatRoutes = (list, result) => {
      list.forEach((item) => {
        result.push(item)
        if (item.children && item.children.length) {
          getFlatRoutes(item.children, result)
        }
      })
      return result
    }
    getFlatRoutes(routes, pages)

    const pagePermissions = permissions.filter((permission) => {
      return permission.entityType === 'admin-page'
    })

    return {
      entities,
      role,
      allActions,
      serverApis,
      apis,
      pages,
      apiPermissions,
      pagePermissions,
    }
  },

  computed: {
    title() {
      return `Phân quyền cho <strong>${this.role.name}</strong>`
    },
    ...mapState(['schemas']),
  },

  methods: {
    getTagType(action) {
      return {
        create: 'primary',
        read: 'info',
        update: 'success',
        delete: 'danger',
      }[action]
    },
    isIndeterminateEntity(entity) {
      return (
        !!entity.permissions.find((e) => e.status) &&
        !this.isAllEntityPermission(entity)
      )
    },
    isAllEntityPermission(entity) {
      return allActions.every(
        (action) =>
          !!entity.permissions.find((e) => e.action === action && e.status)
      )
    },
    isHasEntityPermission(entity, action) {
      return !!entity.permissions.find(
        (item) => item.action === action && item.status
      )
    },
    changeEntityPermission(entity, action, state) {
      const find = entity.permissions.find((item) => item.action === action)
      if (find) {
        find.status = state
      } else {
        entity.permissions.push({
          entityType: 'entity',
          role: getObjectId(this.role),
          entity: entity.key,
          status: state,
          action,
          isAnonymous: this.role.code === 'anonymous',
          isAuthenticated: this.role.code === 'authenticated',
        })
      }
    },
    checkAllEntityPermission(entity, checked) {
      if (checked) {
        allActions.forEach((action) => {
          const find = entity.permissions.find((e) => e.action === action)
          if (find) find.status = true
          else {
            entity.permissions.push({
              entityType: 'entity',
              role: getObjectId(this.role),
              entity: entity.key,
              status: true,
              action,
              isAnonymous: this.role.code === 'anonymous',
              isAuthenticated: this.role.code === 'authenticated',
            })
          }
        })
      } else {
        entity.permissions.forEach((p) => (p.status = false))
      }
    },

    async handleSave() {
      try {
        const permissions = [...this.pagePermissions, ...this.apiPermissions]

        Object.keys(this.entities).forEach((key) => {
          const entity = this.entities[key]
          entity.permissions.forEach((p) => {
            permissions.push(p)
          })
        })
        const response = await this.$axios.$put('/admin/update-permission', {
          permissions,
        })
        console.log(response)
        this.$message.success('Cập nhật thành công')
        setTimeout(() => {
          this.$router.go()
        }, 200)
      } catch (error) {
        console.error(error)
        this.$message.error('Có lỗi xảy ra')
      }
    },
    handleChangeOnlySelf(entity, action, state) {
      const find = entity.permissions.find((e) => e.action === action)
      if (find) {
        find.onlySelf = state
        Utils.replace(entity.permissions, find, (e) => e === find)
      }
    },
    isOnlySelf(entity, action) {
      return !!entity.permissions.find((e) => e.action === action && e.onlySelf)
    },
    // API PERMISSION
    changeApiPermission(api, state) {
      console.log('changeApiPermission', api, state)
      const find = this.apiPermissions.find(
        (p) => p.method === api.method && p.endpoint === api.path
      )
      if (find) {
        find.status = state
      } else {
        this.apiPermissions.push({
          entityType: 'api',
          role: getObjectId(this.role),
          status: state,
          isAnonymous: this.role.code === 'anonymous',
          isAuthenticated: this.role.code === 'authenticated',
          endpoint: api.path,
          method: api.method,
        })
      }
    },

    isHasApiPermission(api) {
      return !!this.apiPermissions.find(
        (p) => p.method === api.method && p.endpoint === api.path && p.status
      )
    },

    changePagePermission(page, state) {
      console.log('changePagePermission', page, state)
      const find = this.pagePermissions.find((p) => p.pageName === page.name)
      if (find) {
        find.status = state
      } else {
        this.pagePermissions.push({
          entityType: 'admin-page',
          role: getObjectId(this.role),
          status: state,
          isAnonymous: this.role.code === 'anonymous',
          isAuthenticated: this.role.code === 'authenticated',
          pageName: page.name,
        })
      }
    },

    isHasPagePermission(page) {
      return !!this.pagePermissions.find(
        (p) => p.pageName === page.name && p.status
      )
    },
  },
}
</script>

<style lang="scss">
.permission-page {
  .page-item {
    margin-right: 0px;
    display: flex;
    .el-checkbox__input {
      margin-top: 4px;
    }
  }
}
</style>

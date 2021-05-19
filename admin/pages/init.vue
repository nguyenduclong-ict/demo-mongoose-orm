<template>
  <div id="login-page">
    <el-card class="max-w-md w-full">
      <div slot="header">Khởi tạo tài khoản Admin</div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        @keyup.enter.native.exact="handleSubmit"
      >
        <el-form-item prop="username" label="Tên đăng nhập">
          <el-input v-model="form.username" placeholder="Username"></el-input>
        </el-form-item>

        <el-form-item prop="password" label="Mật khẩu">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="Mật khẩu"
          ></el-input>
        </el-form-item>

        <el-form-item prop="confirmPwd" label="Nhập lại mật khẩu">
          <el-input
            v-model="form.confirmPwd"
            type="password"
            show-password
            placeholder="Nhập lại mật khẩu"
          ></el-input>
        </el-form-item>

        <el-button type="primary" class="w-full" @click="handleSubmit">
          Khởi tạo
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ROUTES } from '~/config/constants/routes'
export default {
  auth: false,
  layout: 'empty',

  async asyncData({ $api, $axios, redirect }) {
    const isInited = await $axios.$get('/auth/inited')
    console.log(isInited)
    if (isInited) {
      return redirect({ name: ROUTES.Redirect })
    }
  },

  data() {
    return {
      form: {
        username: '',
        password: '',
        confirmPwd: '',
        profile: {
          name: '',
        },
      },
      rules: {
        username: {
          required: true,
        },
        password: {
          required: true,
        },
        confirmPwd: {
          required: true,
          validator: (rule, value, cb) => {
            if (!value || value !== this.form.password) {
              return cb(new Error('Mật khẩu không chính xác'))
            }

            cb()
          },
        },
      },
    }
  },

  methods: {
    async handleSubmit() {
      try {
        const valid = await this.validateForm(this.$refs.form)
        if (!valid) return

        const payload = {
          admin: {
            ...this.form,
          },
        }

        const loading = this.$loading({
          text: 'Đang khởi tạo tài khoản admin...',
          lock: true,
        })
        const { token } = await this.$axios.$post('/auth/init', payload)
        loading.text = 'Thành công, đang đăng nhập...'
        await this.$auth.getStrategy().setUserToken(token)
        setTimeout(() => {
          this.$router.go()
          loading.close()
        }, 1000)
      } catch (error) {
        this.$message.error(this.getErrorMessage(error))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
#login-page {
  width: 100vw;
  height: 100vh;
  background-color: #2d3a4b;
  overflow: auto;

  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

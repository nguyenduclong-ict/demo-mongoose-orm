<template>
  <div id="login-page">
    <el-card class="max-w-md w-full">
      <div slot="header">Login</div>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="Username"></el-input>
        </el-form-item>

        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="Password"
          ></el-input>
        </el-form-item>

        <el-button type="primary" class="w-full" @click="login">
          Đăng nhập
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

  data() {
    return {
      form: {
        username: '',
        password: '',
      },
      rules: {
        username: {
          required: true,
        },
        password: {
          required: true,
        },
      },
    }
  },

  methods: {
    async login() {
      try {
        if (!(await this.validateForm(this.$refs.form))) return
        await this.$auth.loginWith('local', { data: this.form })
        this.$router.push({ name: ROUTES.Redirect })
      } catch (error) {
        console.log(error)
        this.$message.error(error.message)
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

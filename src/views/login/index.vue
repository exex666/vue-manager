<template>
  <div class="loginContainer">
    <transition name="formFade" ref="form">
      <div class="content">
         <h1 class="title">elm后台管理系统</h1>
        <el-form :rules="rule" class="form" label-width="0">
        <el-form-item >
          <el-input placeholder="用户名" prop="username" v-model="formData.user_name"></el-input>
        </el-form-item>
        <el-form-item >
          <el-input placeholder="密码" prop="password" show-password type="password" v-model="formData.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="btn" @click="login">登陆</el-button>
        </el-form-item>
        <ul class="tips">
          <li>温馨提示：</li>
          <li>未登录过的新用户，自动注册</li>
          <li>注册过的用户可凭账号密码登录</li>
        </ul>
      </el-form>
      </div>
    </transition>
  </div>
</template>

<script>
import { login } from '@/utils/http.js'
import { mapMutations, mapState } from 'vuex'
export default {
  name: 'Login',

  data() {
    return {
      rule: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur', },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur', },
        ],
      },
      formData: {
        user_name: '',
        password: '',
      },
    }
  },

  async mounted() {
    if (this.$store.state.adminInfo.id) {
      this.getInfo()
    }
  },
  computed: {
    ...mapState(['adminInfo']),
  },
  watch: {
    adminInfo(newVal, oldVal) {
      if (newVal.id) {
        this.$router.push('/home')
        if (oldVal.id && oldVal.id === newVal.id) {
          this.$message({
            type: 'success',
            message: '检测到您之前登录过，将自动登录',
          })
        } else {
          this.$message({
            type: 'success',
            message: '登录成功',
          })
        }
      }
    },
  },
  methods: {
    ...mapMutations(['getInfo']),
    async login() {
      const { data, } = await login(this.formData)
      if (data.status === 1) {
        this.getInfo()
      } else {
        this.$message({
          type: 'warning',
          message: '登录失败',
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
  .loginContainer {
    width: 100vw;
    height: 100vh;
    background-color: #324057;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .title {
      color: #fff;
      text-align: center;
      margin-bottom: 50px;
      margin-top: 0;
    }
    .form {
      width: 370px;
      height: 270px;
      background-color: #fff;
      border-radius: 5px;
      padding: 25px;
      .btn {
        width: 100%;
      }
    }
    .tips {
      list-style: none;
      li {
        text-align: center;
        color:#FF0000;
        font-size: 12px;

      }
    }
  }
</style>

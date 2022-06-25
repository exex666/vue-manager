<template>
  <div class="illustrationContainer">
      <ul class="illustration">
        <li>node-elm后台管理系统</li>
        <li>第一次登录的用户自动注册成为普通管理员</li>
        <li>普通管理员可以添加，修改信息</li>
        <li>超级管理员可以删除信息</li>
      </ul>
  </div>
</template>

<script>
export default {
  name: 'Illustration',

  data() {
    return {

    }
  },

  mounted() {

  },

  methods: {

  },
}
</script>

<style lang="scss" scoped>
.illustrationContainer {
  width: 100%;
  height: 100%;
  .illustration {
      li {
        text-align: center;
        margin-top: 20px;
        font-size: 20px;
      }
    }
}
</style>

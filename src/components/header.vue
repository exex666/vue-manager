<template>
  <div class="header">
    <div class="path">
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    </div>
        <div class="avatarContainer">
        <img class="avatar" :src="imgUrl"/>
        <div class="menuContent">
          <div class="menuItem" @click="toHome">首页</div>
          <div class="menuItem" @click="logOut">退出</div>
        </div>
        </div>
  </div>
</template>

<script>
import { http } from '@/utils/http.js'
import { mapMutations } from 'vuex'
export default {
  name: 'Header',
  // props: {
  //   nav: {
  //     type: Array,
  //     required: true,
  //   },
  // },
  data() {
    return {

    }
  },

  mounted() {

  },
  computed: {
    imgUrl() {
      return http.defaults.baseURL + '/img/' + this.$store.state.adminInfo.avatar
    },
  },
  methods: {
    ...mapMutations(['logout']),
    toHome() {
      this.$router.push('/home')
    },
    logOut() {
      this.logout()
      this.$router.push('/')
    },
  },
}
</script>

<style lang="scss" scoped>
  .header {
    width: 100%;
    height: 60px;
    background-color: #EFF2F7;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .path {
      margin-left: 20px;
      color: #97A8BE;
      box-sizing: border-box;
      display: flex;
      align-items: center;
    }
    // .right {
    //   position: relative;
    //   height: 100%;
    //   width: 100px;
    // }
    .avatarContainer {
      height: 36px;
      width: 36px;
      margin-right: 36px;
      position: relative;
      .avatar {
        vertical-align: top;
         border-radius: 50%;
        overflow: hidden;
        height: 100%;
        width: 100%;
        padding: 0;
        margin: 0;
      }
    }
    .menuContent {
      height: 0;
      overflow: hidden;
      position: absolute;
      background-color: #f9f9f9;
      min-width: 120px;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
      left: 50%;
      top: 100%;
      transform: translate(-50%,5px);
      transition: all .2s;
      .menuItem {
        height: 40px;
        line-height: 40px;
        width: 100%;
        text-align: center;
        cursor: pointer;
        &:hover {
          background-color: #f1f1f1;
        }
      }
    }
    .avatarContainer:hover .menuContent {
      height: 80px;
    }
  }
</style>

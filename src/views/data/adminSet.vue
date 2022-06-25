<template>
  <div class="infoContainer">
    <el-row>
      <el-col :span="14" :offset="5">
        <div class="infoContent" v-if="adminInfo.id">
          <h3 class="title">管理员信息</h3>
          <article class="detail" >
            <div class="name">姓名：{{adminInfo.user_name}}</div>
            <div class="regTime">注册时间：{{adminInfo.create_time}}</div>
            <div class="authority">管理员权限：{{adminInfo.admin}}</div>
            <div class="adminId">管理员 ID：{{adminInfo.id}}</div>
            <div class="avatar">
              更换头像：
              <img :src="imgSrc" alt="" class="avator">
            </div>
          </article>
        </div>
        <div class="unshow" v-else>
          <h3 class="title">用户未登录</h3>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { http } from '@/utils/http.js'
export default {
  name: 'AdminSet',

  data() {
    return {
    }
  },

  mounted() {

  },
  computed: {
    ...mapState(['adminInfo']),
    imgSrc() {
      return http.defaults.baseURL + '/img/' + this.adminInfo.avatar
    },
  },
  methods: {

  },
}
</script>

<style lang="scss" scoped>
  .infoContainer {
    color: #666666;
    width: 100%;
    height: 100%;
    .title {
      text-align: center;
    }
    .detail {
      height: 440px;
      background-color: #F9FAFC;
      border-radius: 10px;
      &>div {
        padding: 20px;
        font-size: 17px;
      }
      .avator {
        display: block;
        height: 120px;
        width: 120px;
      }
    }
  }
</style>

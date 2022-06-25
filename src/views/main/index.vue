<template>
  <div class="mainContainer">
    <div class="left">
      <AsideList :option="option"></AsideList>
    </div>
    <div class="right">
      <div class="header">
         <Header></Header>
      </div>
      <div class="body">
        <keep-alive exclude="AddFood">
          <router-view/>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
import AsideList from '@/components/asideList.vue'
import Header from '@/components/header.vue'
import { mapState } from 'vuex'
export default {
  name: 'Main',
  components: {
    AsideList,
    Header,
  },
  data() {
    return {
      option: [
        {
          title: '首页',
          icon: 'icon-shouyetianchong',
          url: '/home',
        },
        {
          title: '数据管理',
          expand: false,
          icon: 'icon-shujuguanli',
          list: [
            {
              title: '用户列表',
              url: '/userlist',
            },
            {
              title: '商家列表',
              url: '/shoplist',
            },
            {
              title: '食品列表',
              url: '/foodlist',
            },
            {
              title: '订单列表',
              url: '/orderlist',
            },
            {
              title: '管理员列表',
              url: '/adminlist',
            },
          ],
        },
        {
          title: '添加数据',
          expand: false,
          icon: 'icon-chuangjiantianjiapiliangtianjia',
          list: [
            {
              title: '添加商铺',
              url: '/addshop',
            },
            {
              title: '添加商品',
              url: '/addfood',
            },
          ],
        },
        {
          title: '图表',
          expand: false,
          icon: 'icon-shuju',
          list: [
            {
              title: '用户分布',
              url: '/userdistribution',
            },
          ],
        },
        {
          title: '编辑',
          expand: false,
          icon: 'icon-bianji1',
          list: [
            {
              title: '文本编辑',
            },
          ],
        },
        {
          title: '设置',
          expand: false,
          icon: 'icon-shezhi',
          list: [
            {
              title: '管理员设置',
              url: '/adminset',
            },
          ],
        },
        {
          title: '说明',
          expand: false,
          icon: 'icon-shuoming',
          list: [
            {
              title: '说明',
              url: '/illustration',
            },
          ],
        },
      ],
    }
  },

  mounted() {
    if (!this.adminInfo.id) {
      this.$router.push('/login')
      this.$message({
        type: 'warning',
        message: '请登录',
      })
    }
  },
  computed: {
    ...mapState(['adminInfo']),
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.mainContainer {
  display: flex;
  flex-direction: row;
  height: 100vh;
  .left {
    width: 16%;
    min-width: 200px;
    height: 100%;
  }
  .right {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
    min-width: 900px;
    overflow: auto;
    .body {
      flex: 1;
    }
    &::-webkit-scrollbar {
      display: none;
    }
  }
}

</style>

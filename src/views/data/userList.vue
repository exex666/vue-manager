<template>
  <div class="listContainer">
    <table class="table  table-hover">
      <thead bgcolor="#EEF1F6">
        <tr>
          <th class="col-md-1" ><div style="margin-left:10px;">#</div></th>
          <th class="col-md-3">注册日期</th>
          <th class="col-md-3">用户姓名</th>
          <th class="col-md-5">注册地址</th>
        </tr>
      </thead>
      <tbody v-if="listData.length>0">
        <tr v-for="(item,index) in listData" :key="item.id">
          <td ><div style="margin-left:10px;">{{index+1}}</div></td>
          <td>{{item.registe_time}}</td>
          <td>{{item.username}}</td>
          <td>{{item.city}}</td>
        </tr>
      </tbody>
      <tr v-else>
        <td colspan="4" align="center" height="50">暂无数据</td>
      </tr>
    </table>
    <div class="pager">
      <Pager  @pagechange="pageChange" :totalPage="allPage" :count="count"></Pager>
    </div>
  </div>
</template>

<script>
import Pager from '@/components/pager.vue'
import { getUserList, getUserCount } from '@/utils/http.js'
export default {
  name: 'UserList',
  components: {
    Pager,
  },
  data() {
    return {
      listData: [],
      page: 1,
      limit: 20,
      count: 0,
      allPage: 1,
    }
  },

  mounted() {
    this.getData()
  },
  computed: {
    offset() {
      return (this.page - 1) * this.limit
    },
  },
  methods: {
    pageChange(e) {
      this.page = e.value
      this.getData()
    },
    async getData() {
      const { data, } = await getUserList({ offset: this.offset, limit: this.limit, })
      const { data: count, } = await getUserCount()
      this.listData = data
      this.count = count.count
      this.allPage = Math.ceil(this.count / this.limit)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/sass/table.scss';
</style>

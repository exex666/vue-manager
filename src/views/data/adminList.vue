<template>
  <div class="listContainer">
    <table class="table  table-hover">
      <thead bgcolor="#EEF1F6">
        <tr>
          <th class="col-md-3" ><div style="margin-left:15px;">姓名</div></th>
          <th class="col-md-3">注册日期</th>
          <th class="col-md-2">地址</th>
          <th class="col-md-4">权限</th>
        </tr>
      </thead>
      <tbody v-if="listData.length>0">
        <tr v-for="item in listData" :key="item.id">
          <td><div style="margin-left:15px;">{{item.user_name}}</div></td>
          <td>{{item.create_time}}</td>
          <td>{{item.city}}</td>
          <td>{{item.admin}}</td>
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
import { getAdminList, getAdminCount } from '@/utils/http.js'
import { pager } from '@/mixin/pagerMix.js'
export default {
  name: 'AdminList',
  mixins: [pager],
  data() {
    return {
      listData: [],
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      this.listData = (await getAdminList({ offset: this.offset, limit: this.limit, })).data.data
      this.count = (await getAdminCount()).data.count
      this.allPage = Math.ceil(this.count / this.limit)
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/sass/table.scss';
</style>

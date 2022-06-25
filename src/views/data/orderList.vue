<template>
  <div class="listContainer">
    <table class="table  table-hover" >
      <thead bgcolor="#EEF1F6">
        <tr>
          <th width="4%"></th>
          <th width="32%"><div style="margin-left:10px;">订单 ID</div></th>
          <th width="32%">总价格</th>
          <th width="32%">订单状态</th>
        </tr>
      </thead>
      <tbody v-if="listData.length>0">
        <template v-for="(item,index) in listData">
          <tr :key="'synopsis'+item.id" >
            <td style="cursor:pointer;padding: 0;position:relative;" @click="expand(index)">
              <div class="iconBox">
                <div :class="['iconfont','icon-113fangxiang_xiangyou',{'iconBoxDown':item.expand}]"></div>
              </div>
            </td>
            <td class="item">{{item.id}}</td>
            <td class="item">{{item.total_amount}}</td>
            <td class="item">{{item.status_bar.title||'未知'}}</td>
          </tr>
          <tr v-if="item.expand&&item.expandData" :key="'detail'+item.id" >
            <td colspan="5" style="padding: 0;" >
              <div class="Detail">
                  <div class="detailItem">
                    <div class="name">用户名</div>
                    <div class="value">
                      <div>{{item.expandData.user_name}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">店铺名称</div>
                    <div class="value">
                      <div>{{item.expandData.restaurant_name}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">收货地址</div>
                    <div class="value">
                      <div>{{item.expandData.shipping_address}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">店铺 ID</div>
                    <div class="value">
                      <div>{{item.expandData.restaurant_id}}</div>
                    </div>
                  </div>
                  <div class="detailItem">
                    <div class="name">店铺地址</div>
                    <div class="value">
                      <div>{{item.expandData.shop_address}}</div>
                    </div>
                  </div>
              </div>
            </td>
          </tr>
        </template>
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
import { pager } from '@/mixin/pagerMix.js'
import { getOrderList, getOrderCount, getShop, getUser, getAddress } from '@/utils/http.js'
export default {
  name: 'OrderList',
  mixins: [pager],
  data() {
    return {
    }
  },

  mounted() {
    this.initTable()
  },

  methods: {
    async initTable() {
      const { data: count, } = await this.getCount()
      this.count = count.count
      this.allPage = Math.ceil(this.count / this.limit)
      this.getData()
    },
    async getData() {
      const params = {
        limit: this.limit,
        offset: this.offset,
      }
      const { data, } = await this.getList(params)
      this.listData = data.map(val => {
        val.expand = false
        return val
      })
    },
    async getList(params) {
      return await getOrderList(params)
    },
    async getCount() {
      return await getOrderCount()
    },
    async expand(index) {
      if (!this.listData[index].expandData) {
        const expandData = {}
        expandData.restaurant_name = this.listData[index].restaurant_name
        expandData.restaurant_id = this.listData[index].restaurant_id
        expandData.shop_address = (await getShop(this.listData[index].restaurant_id)).data.address
        expandData.shipping_address = (await getAddress(this.listData[index].address_id)).data.address
        expandData.user_name = (await getUser(this.listData[index].user_id)).data.username
        this.listData[index].expandData = expandData
      }
      this.listData[index].expand = !this.listData[index].expand
    },
  },
}
</script>

<style lang="scss" scoped>
  @import '@/sass/table.scss';
</style>

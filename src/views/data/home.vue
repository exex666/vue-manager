<template>
  <div class="home">
    <h1 class="title">数据统计</h1>
    <div class="data">
      <div class="dataLine">
        <div class="dailyData"><div class="content">当日数据:</div></div>
        <div class="dataItem"><div class="content"><span class="emphasis">{{todayCount.userCount}}</span>新增用户</div></div>
        <div class="dataItem"><div class="content"><span class="emphasis">{{todayCount.orderCount}}</span>新增订单</div></div>
        <div class="dataItem"><div class="content"><span class="emphasis">{{todayCount.adminCount}}</span>新增管理员</div></div>
      </div>
      <div class="dataLine">
        <div class="allData"><div class="content">总数据:</div></div>
        <div class="dataItem"><div class="content"><span class="emphasis">{{count.userCount}}</span>注册用户</div></div>
        <div class="dataItem"><div class="content"><span class="emphasis">{{count.orderCount}}</span>订单</div></div>
        <div class="dataItem"><div class="content"><span class="emphasis">{{count.adminCount}}</span>管理员</div></div>
      </div>
    </div>
    <div class="chartContainer" >
      <div class="chart" ref="chart"></div>
    </div>
  </div>
</template>

<script>
import { getOrderDailyCount, getOrderCount, getUserDailyCount, getUserCount, getAdminDailyCount, getAdminCount } from '@/utils/http.js'
import { dateFormatter } from '@/utils/timeFomatter.js'
export default {
  name: 'Home',

  data() {
    return {
      count: {
        userCount: 0,
        adminCount: 0,
        orderCount: 0,
      },
      todayCount: {
        userCount: 0,
        adminCount: 0,
        orderCount: 0,
      },
      weekCount: {
        days: [],
        userCount: [],
        adminCount: [],
        orderCount: [],
      },
      chart: null,
    }
  },

  mounted() {
    this.initData()
    window.addEventListener('resize', this.screenAdapt)
  },

  methods: {
    initData() {
      this.getCount()
      this.getTodayCount()
      this.chart = this.$echarts.init(this.$refs.chart)
      const option = {
        title: {
          text: '走势图',
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
          max: 200,
        },
        legend: {

        },
        tooltip: {
          trigger: 'axis',
        },
        toolbox: {
          feature: {
            dataView: {},
            dataZoom: {},
            magicType: {
              type: ['line', 'bar'],
            },
            restore: {},
          },
        },
      }
      this.chart.setOption(option)
      this.getWeeklyCount()
    },
    async getCount() {
      this.count.userCount = (await getUserCount()).data.count
      this.count.adminCount = (await getAdminCount()).data.count
      this.count.orderCount = (await getOrderCount()).data.count
    },
    async getTodayCount() {
      const date = Date.now()
      this.todayCount = await this.getDailyCount(date)
    },
    async getDailyCount(dateTime) {
      const date = dateFormatter(dateTime)
      const orderCount = Promise.resolve(getOrderDailyCount(date))
      const adminCount = Promise.resolve(getAdminDailyCount(date))
      const userCount = Promise.resolve(getUserDailyCount(date))
      const countData = await Promise.all([userCount, adminCount, orderCount])
      const dayCount = {
        userCount: countData[0].data.count,
        adminCount: countData[1].data.count,
        orderCount: countData[2].data.count,
      }
      return dayCount
    },
    async getWeeklyCount() {
      let date = Date.now()
      const dayMiliseconds = 1000 * 60 * 60 * 24
      const userCount = []
      const adminCount = []
      const orderCount = []
      const days = []
      for (let i = 0; i < 7; i++) {
        const formatDate = dateFormatter(date)
        const dayCount = await this.getDailyCount(formatDate)
        userCount.unshift(dayCount.userCount)
        adminCount.unshift(dayCount.adminCount)
        orderCount.unshift(dayCount.orderCount)
        days.unshift(formatDate)
        date -= dayMiliseconds
      }
      this.weekCount.days = days
      this.weekCount.userCount = userCount
      this.weekCount.adminCount = adminCount
      this.weekCount.orderCount = orderCount
      const option = {
        xAxis: {
          data: this.weekCount.days,
        },
        series: [
          {
            name: '新注册用户',
            type: 'line',
            data: this.weekCount.userCount,
            markPoint: {
              data: [
                { type: 'max', name: '最大值', },
                { type: 'min', name: '最小值', },
              ],
            },
          },
          {
            name: '新增订单',
            type: 'line',
            data: this.weekCount.orderCount,
            markPoint: {
              data: [
                { type: 'max', name: '最大值', },
                { type: 'min', name: '最小值', },
              ],
            },
          },
          {
            name: '新增管理员',
            type: 'line',
            data: this.weekCount.adminCount,
            markPoint: {
              data: [
                { type: 'max', name: '最大值', },
                { type: 'min', name: '最小值', },
              ],
            },
          },
        ],
      }
      this.chart.setOption(option)
    },
    screenAdapt() {
      this.chart.resize()
    },
  },
}
</script>

<style lang="scss" scoped>
  .home {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .title {
      text-align: center;
      margin-top: 20px;
    }
    .data {
      height: 15%;
      min-height: 90px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      .dataLine {
        height: 35%;
        display: flex;
        .dataItem {
          height: 100%;
          width: 180px;
          text-align: center;
          margin-left: 20px;
          border-radius: 10px;
          background-color: #E5E9F2;
          .content {
            position: relative;
            top: 50%;
            left: 0;
            transform: translateY(-50%);
            font-size: 14px;
            .emphasis {
              font-size: 22px;
              font-weight: 600;
              margin-right: 5px
            }
          }
        }
        .dailyData,
        .allData {
           @extend .dataItem;
           color: #fff;
           .content {
            font-size: 18px;
           }
        }
        .dailyData {
           background-color: #FF9800;
        }
        .allData {
          background-color: #54A5E8;
        }
      }
    }
    .chartContainer {
      height: 65%;
      width: 100%;
      min-width: 800px;
      min-height: 400px;
      margin-top: 20px;
      .chart {
        width: 80%;
        height: 100%;
        position: relative;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }
</style>

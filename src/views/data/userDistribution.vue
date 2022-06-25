<template>
  <div class="chartContainer">
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import { getUserDistribution } from '@/utils/http.js'
export default {
  name: 'UserDistribution',

  data() {
    return {
      chartInstance: null,
      data: [],
    }
  },

  mounted() {
    this.initChart()
  },

  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.chart)
      const option = {
        title: {
          text: '用户分布',
          left: 'center',
          top: '3%',
          textStyle: {
            fontSize: 30,
          },
        },
        legend: {
          orient: 'vertical',
          left: '5%',
          top: '3%',
        },
        series: {
          radius: '70%',
          type: 'pie',
          center: ['50%', '55%'],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          animationEasing: 'bounceOut',
        },
      }
      this.chartInstance.setOption(option)
      this.getData()
    },
    async getData() {
      this.chartInstance.showLoading()
      const { data, } = await getUserDistribution()
      this.data = data.user_city
      const option = {
        series: {
          data: [
            { name: '北京', value: this.data.beijing, },
            { name: '上海', value: this.data.shanghai, },
            { name: '深圳', value: this.data.shenzhen, },
            { name: '杭州', value: this.data.hangzhou, },
            { name: '其他', value: this.data.qita, },
          ],
        },
      }
      this.chartInstance.setOption(option)
      this.chartInstance.hideLoading()
    },
  },
}
</script>

<style lang="scss" scoped>
  .chartContainer {
    width: 100%;
    height: 100%;
    .chart {
      width: 100%;
      height: 100%;
    }
  }
</style>

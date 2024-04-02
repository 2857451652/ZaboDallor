<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
const Random = {
  mem_utilization: [59.26, 53.6, 59.75, 45.32, 56.73, 54.09, 53.24, 52.06,
    52.48, 56.06, 58.81, 49.93, 51.4, 56.41, 46.07, 56.05, 51.42, 54.71, 58.84,
    53.54, 53.27, 59.48, 53.14, 45.88, 58.3, 46.22, 45.54, 52.5, 55.51, 52.26],
  cpu_utilization: [41.29, 45.97, 45.09, 49.61, 44.49, 44.93, 48.7, 46.93,
    48.89, 45.81, 42.23, 42.4, 46.1, 47.85, 45.86, 45.35, 46.94, 40.84, 48.34,
    47.1, 41.73, 45.12, 47.83, 48.06, 48.19, 43.07, 44.74, 45.48, 45.74, 40.73],
  temperature: [60.8, 59.36, 63.59, 65.42, 64.0, 68.11, 65.71, 66.84, 69.83,
    65.92, 66.45, 70.79, 74.77, 76.5, 72.08, 67.25, 70.42, 67.63, 65.22, 68.48,
    73.33, 72.07, 72.61, 73.94, 71.82, 76.31, 74.6, 73.85, 78.42, 74.63]
}

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      random_num: 0,
      used: 0.6776,
      leisure: 1 - 0.6776
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    this.timer = window.setInterval(() => {
      setTimeout(() => { this.setRandom() }, 0)
    }, 5000)
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          left: 'center',
          bottom: '10',
          data: ['占用', '空闲']
        },
        series: [
          {
            name: 'memory utilization',
            type: 'pie',
            roseType: 'radius',
            radius: [0, 60],
            center: ['50%', '38%'],
            data: [
              { value: this.leisure, name: '空闲' },
              { value: this.used, name: '占用' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    },
    setRandom() {
      this.used = Random.mem_utilization[this.random_num % 30] / 100
      this.leisure = 1 - this.used
      this.random_num++
      // this.chart.setOption({
      //   tooltip: {
      //     trigger: 'item',
      //     formatter: '{a} <br/>{b} : {c} ({d}%)'
      //   },
      //   legend: {
      //     left: 'center',
      //     bottom: '10',
      //     data: ['used', 'leisure']
      //   },
      //   series: [
      //     {
      //       name: 'memory utilization',
      //       type: 'pie',
      //       roseType: 'radius',
      //       radius: [0, 60],
      //       center: ['50%', '38%'],
      //       data: [
      //         { value: this.leisure, name: 'leisure' },
      //         { value: this.used, name: 'used' }
      //       ],
      //       animationEasing: 'cubicInOut',
      //       animationDuration: 2600
      //     }
      //   ]
      // })
    }
  }
}
</script>

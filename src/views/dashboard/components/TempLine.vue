
<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import moment from 'moment'

const display_time = moment()

const History = {
  mem_utilization: [52.28, 30.2, 42.28, 46.63, 56.29, 69.33, 68.83, 67.76],
  cpu_utilization: [42.33, 15.49, 30.28, 45.63, 51.29, 49.33, 48.83, 47.76],
  temperature: [40.0, 35.7, 53.1, 60, 61.2, 70.4, 65.3, 64.0],
  time: [
    moment().subtract(35, 'seconds').format('HH:mm:ss'), 
    moment().subtract(30, 'seconds').format('HH:mm:ss'), 
    moment().subtract(25, 'seconds').format('HH:mm:ss'), 
    moment().subtract(20, 'seconds').format('HH:mm:ss'),  
    moment().subtract(15, 'seconds').format('HH:mm:ss'),  
    moment().subtract(10, 'seconds').format('HH:mm:ss'), 
    moment().subtract(5, 'seconds').format('HH:mm:ss'), 
    moment().format('HH:mm:ss')]
}

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
var random_num = 0
var hour = 2
var minute = 40

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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    display_time: new Date(),
  },
  data() {
    return {
      chart: null
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
    this.timer = window.setInterval(() => {
      setTimeout(() => { this.setRandom() }, 0)
    }, 8000)
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
      this.setOptions(this.chartData)
    },
    setOptions() {
      this.chart.setOption({
        xAxis: {
          data: History.time,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        yAxis: {
          name: '(℃)',
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: [5, 10]
        },
        legend: {
          data: ['温度']
        },
        series: [
          {
            name: '温度',
            smooth: true,
            type: 'line',
            itemStyle: {
              normal: {
                color: '#FFCC33',
                lineStyle: {
                  color: '#FFCC33',
                  width: 2
                },
                areaStyle: {
                  color: '#FFFFCC'
                }
              }
            },
            data: History.temperature,
            animationDuration: 2800,
            animationEasing: 'quadraticOut'
          }]
      })
    },
    setRandom() {
      if (History.temperature.length >= 15) {
        History.temperature.shift()
        History.cpu_utilization.shift()
        History.mem_utilization.shift()
        History.time.shift()
      }
      History.temperature.push(Random.temperature[random_num % 30])
      History.cpu_utilization.push(Random.cpu_utilization[random_num % 30])
      History.mem_utilization.push(Random.mem_utilization[random_num % 30])
      History.time.push(moment().format('HH:mm:ss'))
      this.addTime()
      random_num++
      this.setOptions()
    },
    addTime() {
      minute += 5
      if (minute === 60) {
        hour++
        minute = 0
      }
      if (hour === 25) {
        hour = 0
      }
    }
  }
}
</script>

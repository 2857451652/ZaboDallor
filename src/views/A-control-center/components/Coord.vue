<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

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
    }
  },
  data() {
    return {
      chart: null,
      chartData: {
        lg: [111.25, 111.1, 110.95, 110.8, 110.65, 110.5, 110.37],
        lt: [56.38, 56.08, 55.77, 55.47, 55.15, 54.83, 54.53]
      }
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
    setOptions({ actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          data: [' 2022-04-24 11:53:05.529', ' 2022-04-24 11:53:11.779', ' 2022-04-24 11:53:15.533', ' 2022-04-24 11:53:20.530',
            ' 2022-04-24 11:53:25.539', ' 2022-04-24 11:53:30.539', ' 2022-04-24 11:53:35.554'],
          boundaryGap: false,
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
        yAxis: {
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['longitude', 'latitude']
        },
        series: [{
          name: 'longitude',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.chartData.lg,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }, {
          name: 'latitude',
          smooth: true,
          type: 'line',
          itemStyle: {
            normal: {
              color: '#4d5663',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: this.chartData.lt,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }
        ]
      })
    }
  }
}
</script>

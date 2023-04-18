<template>
  <div ref="refChart" style="width: 100%; height: 400px" />
</template>

<script>
import echarts from 'echarts'
import 'echarts-gl'
export default {
  name: 'Scatter3D',
  data() {
    return {
      data: [['lg', 'lt', 'height', 'time'],
        ['111.25', '56.38', '489542', '2022-04-24 11:53:05.529'],
        ['111.1', '56.08', '489438', '2022-04-24 11:53:05.529']]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      var myChart = echarts.init(this.$refs.refChart)
      var symbolSize = 2.5
      var option = {
        grid3D: {},
        xAxis3D: {},
        yAxis3D: {},
        zAxis3D: {},
        dataset: {
          dimensions: [
            'lg',
            'lt',
            'height',
            { name: 'time', type: 'ordinal' }
          ],
          source: this.data
        },
        series: [
          {
            type: 'scatter3D',
            symbolSize: symbolSize,
            encode: {
              x: 'lg',
              y: 'lt',
              z: 'height',
              tooltip: [0, 1, 2, 3]
            }
          }
        ]
      }
      myChart.setOption(option)
    }
  }
}

</script>

<style scoped>

</style>

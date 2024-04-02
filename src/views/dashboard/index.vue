<template>
  <div class="dashboard-editor-container">
    <el-card>
      <el-row style="text-align:center; margin-bottom:20px">
        <span style="font-size:40px;">
          <i class="el-icon-odometer" style="margin-right:10px" />卫星状态信息
        </span>
      </el-row>
      <el-row>
        <span style="margin-left:10px;margin-bottom:5px">CPU温度</span>
        <el-progress
          :text-inside="true"
          :stroke-width="26"
          :percentage="tem"
          :format="format"
          :color="customColors"
        />
      </el-row>
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <el-col :xs="24" :sm="24" :lg="8" style="text-align:center;">
          <span>CPU利用率</span>
          <div class="chart-wrapper">
            <cpu-pie />
          </div>
        </el-col>
        <el-col :xs="48" :sm="48" :lg="16" style="text-align:center;">
          <span>CPU温度变化记录</span>
          <temp-line/>
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8" style="text-align:center;">
          <span>内存占用</span>
          <div class="chart-wrapper">
            <memory-pie />
          </div>
        </el-col>
        <el-col :xs="48" :sm="48" :lg="16" style="text-align:center;">
          <span>CPU/内存占用记录</span>
          <usage-line/>
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-row>
        <el-col style="margin-left:10px">
          ID:
          <el-input v-model="input" placeholder="Please enter PID" style="width:150px" />
          <el-button type="primary">查询</el-button>
          <el-divider direction="vertical" />
          <span style="margin-left:20px" />
        </el-col>

      </el-row>
      <el-row :gutter="8">
        <el-col style="padding-right:8px;margin-bottom:30px;">
          <transaction-table />
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import TempLine from './components/TempLine'
import UsageLine from './components/UsageLine'
import MemoryPie from './components/MemoryPie'
import CpuPie from './components/CpuPie'
import TransactionTable from './components/TransactionTable'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  }

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

export default {
  name: 'DashboardAdmin',
  components: {
    TempLine,
    UsageLine,
    MemoryPie,
    CpuPie,
    TransactionTable
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis,
      customColors: [
        { color: '#f56c6c', percentage: 100 },
        { color: '#e6a23c', percentage: 70 },
        { color: '#5cb87a', percentage: 45 },
        { color: '#1989fa', percentage: 20 },
        { color: '#6f7ad3', percentage: 10 }
      ],
      tem: 64.0,
      random_num: 0,
      input_id: 0,
      display_time: new Date(),
    }
  },
  mounted() {
    this.timer = window.setInterval(() => {
      setTimeout(() => { this.setRandom() }, 0)
    }, 8000)
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    },
    format(percentage) {
      return `${percentage}℃`
    },
    setRandom() {
      this.tem = Random.temperature[this.random_num % 30]
      this.random_num++
    },
    generateList(){
      var now_time = new Date();
      var station_loc = [112.59, 28.12] 
      this.list = []
      for(i=0; i>=100; i--){
        now_time.setSeconds(now_time.getSeconds() - 10);
        var ret = this.getOrbitPoint(
          ["1 55261U 23007P   23093.85628476  .00018574  00000+0  65276-3 0  9997",
          "2 55261  97.3598 167.3962 0009698  41.8613  69.7682 15.29378720 12017"], now_time)
        var sate_loc=[ret[0], ret[1]], height = ret[2]
        var angle = this.calWatchAngle(sate_loc, station_loc, height)
        if(angle >= 15){
          this.display_time = now_time
        }
      }
    },
    calWatchAngle(sate_loc, station_loc, height){
      var R = 6371;
      var angle = this.calAngle(sate_loc, station_loc), watch_angle = 0;
      if(angle < 0.2*Math.PI && angle > 0){
        var l1 = R * Math.sin(angle)
        var l2 = R * (1-Math.cos(angle)) + height
        var a = Math.atan(l1/l2)
        watch_angle = (a - angle)*180/Math.PI
      }
      return watch_angle
    },
    calAngle(loc_1, loc_2){
      var coord_1 = this.trans_coord(loc_1)
      var coord_2 = this.trans_coord(loc_2)
      var cos_a = 0
      for(var i=0; i<3; i++)
        cos_a += coord_1[i] * coord_2[i]
      return Math.acos(cos_a)
    },
    trans_coord(loc){
      var lon = loc[0], lat = loc[1];
      var phi = Math.PI/2 - Math.PI*lat/180, theta = Math.PI + Math.PI*lon/180;
      var x = Math.sin(phi) * Math.cos(theta)
      var y = Math.sin(phi) * Math.sin(theta)
      var z = Math.cos(phi)
      return [x, y, z]
    },
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(24, 39, 64); 
  position: relative;  
  height: calc(100vh - 84px); /* 设置高度为视口高度的100% */
  overflow-y: auto; /* 如果内容超过屏幕高度，显示滚动条 */

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

<template>
  <div class="dashboard-editor-container">
    <el-card>
      <el-row style="text-align:center; margin-bottom:20px">
        <span style="font-size:40px;">
          <i class="el-icon-odometer" style="margin-right:10px" />Satellite Status
        </span>
      </el-row>
      <el-row>
        <span style="margin-left:10px;margin-bottom:5px">CPU Temperature</span>
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
          <span>cpu utilization</span>
          <div class="chart-wrapper">
            <cpu-pie />
          </div>
        </el-col>
        <el-col :xs="48" :sm="48" :lg="16" style="text-align:center;">
          <span>temperature history</span>
          <temp-line />
        </el-col>
      </el-row>

      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <span style="margin-left:80px">memory utilization</span>
          <div class="chart-wrapper">
            <memory-pie />
          </div>
        </el-col>
        <el-col :xs="48" :sm="48" :lg="16" style="text-align:center;">
          <span>cpu/memory utilization history</span>
          <usage-line />
        </el-col>
      </el-row>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-row>
        <el-col style="margin-left:10px">
          ID:
          <el-input v-model="input" placeholder="Please enter PID" style="width:150px" />
          <el-button type="primary">CHECK</el-button>
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
      input_id: 0
    }
  },
  mounted() {
    this.timer = window.setInterval(() => {
      setTimeout(() => { this.setRandom() }, 0)
    }, 2000)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(24, 39, 64);
  position: relative;

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

<template>
  <div class="station-container">
    <el-card>
      <el-dropdown @command="switchStation" trigger="click" style="margin-top:10px;margin-bottom:15px">
        <span class="el-dropdown-link">
          <h2 style="color:#409EFF;font-weight: bold;">
            <i class="el-icon-place"/>-{{station_info[chosen_station].station}}
            <i class="el-icon-arrow-down el-icon--right"/>
          </h2>
        </span>
        <el-dropdown-menu slot="dropdown" style="width: 150px;">
          <el-dropdown-item command=0>{{station_info[0].station}}</el-dropdown-item>
          <el-dropdown-item command=1>{{station_info[1].station}}</el-dropdown-item>
          <el-dropdown-item command=2>{{station_info[2].station}}</el-dropdown-item>
          <el-dropdown-item command=3>{{station_info[3].station}}</el-dropdown-item>
          <el-dropdown-item command=4>{{station_info[4].station}}</el-dropdown-item>
          <el-dropdown-item command=5>{{station_info[5].station}}</el-dropdown-item>
          <el-dropdown-item command=6>{{station_info[6].station}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="1">
          <div class="info-div">
            <el-row style="margin-top:15px">
              <span style="float: left;font-weight: bold;">
                地面站名称：
              </span>
              <span style="float: right; width:60%">
                <span style="float: left;">{{station_info[chosen_station].station}}</span>
              </span>
            </el-row>
            <el-row style="margin-top:20px">
              <span style="float: left;font-weight: bold;">
                <i class="el-icon-map-location"/>
                经纬度：
              </span>
              <span style="float: right; width:60%">
                <span style="float: left;">{{station_info[chosen_station].lon}}, {{station_info[chosen_station].lat}}</span>
              </span>
            </el-row>
            <el-row style="margin-top:20px">
              <span style="float: left;font-weight: bold;">
                <i class="el-icon-d-caret"/>
                海拔高度：
              </span>
              <span style="float: right; width:60%">
                <span style="float: left;">{{station_info[chosen_station].alt}}m</span>
              </span>
            </el-row>
            <el-row style="margin-top:20px">
              <span style="float: left;font-weight: bold;">
                <i class="el-icon-position"/>
                天线类型：
              </span>
              <span style="float: right; width:60%">
                <span style="float: left;">{{station_info[chosen_station].antenna}}</span>
              </span>
            </el-row>
            <el-row style="margin-top:20px">
              <span style="float: left;font-weight: bold;">
                <i class="el-icon-circle-check"/>
                历史成功率：
              </span>
              <span style="float: right; width:60%">
                <span style="float: left;">{{station_info[chosen_station].success_rate}}</span>
              </span>
            </el-row>
            <el-row style="margin-top:20px">
              <span style="float: left;font-weight: bold;">
                <i class="el-icon-time"/>
                历史观测次数：
              </span>
              <span style="float: right; width:60%">
                <span style="float: left;">{{station_info[chosen_station].observation}}</span>
              </span>
            </el-row>
          </div>
          <div class="map-div" v-loading="map_loading">
            <echarts_map :chosen_loc="chosen_loc" ref="map"/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="过境时间" name="2">
          <time_table :chosen_station="chosen_station" ref="time_table"/>
        </el-tab-pane>
        <el-tab-pane label="历史状态" name="3">
          <div style="height: 400px;text-align: center;">
            <el-row>
              <el-image :src="src"></el-image>
            </el-row>
            <el-row>
            暂无数据
            </el-row>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </div>

</template>
<script>
import echarts_map from './component/map'
import time_table from './component/TimeTable'

export default {
  name: 'DashboardAdmin',
  components: {
    echarts_map,
    time_table,
  },
  data() {
    return {
      src:require("@/assets/images/empty.png"),
      dataArr: [20, 50, 80, 90, 70, 30, 60, 40, 10, 100],
      activeName: '1',
      station_info:[
        {station:"黑河站", lon:127.53, lat:50.22, alt:500, antenna:"Cross Yagi (UHF)", success_rate:0.85, observation:8520},
        {station:"天算华东站", lon:121.39, lat:37.52, alt:47.8, antenna:"Cross Yagi (UHF)", success_rate:0.82, observation:8520},
        {station:"长沙站", lon:112.59, lat:28.12, alt:58, antenna:"Cross Yagi (UHF)", success_rate:0.79, observation:8520},
        {station:"天算华南站", lon:109.45, lat:24.18, alt:150, antenna:"Cross Yagi (UHF)", success_rate:0.76, observation:8520},
        {station:"酒泉站", lon:98.50, lat:39.71, alt:1350, antenna:"Cross Yagi (UHF)", success_rate:0.89, observation:8520},
        {station:"库尔勒站", lon:86.17, lat:41.72, alt:934, antenna:"Cross Yagi (UHF)", success_rate:0.88, observation:8520},
        {station:"达坂城站", lon:88.31, lat:43.36, alt:1128, antenna:"Cross Yagi (UHF)", success_rate:0.86, observation:8520},
      ],
      chosen_station: 0,
      chosen_loc: [],
      map_loading: 0,
    }
  },
  mounted(){
    this.chosen_station = (this.$route.query.chosen!=undefined)?Number(this.$route.query.chosen):0
    this.chosen_loc = [this.station_info[this.chosen_station].lon, 
                           this.station_info[this.chosen_station].lat]
    this.switchStation(this.chosen_station)
  },
  methods: {
      handleClick(){
        
      },
      switchStation(station_id){
        this.chosen_station = parseInt(station_id)
        this.chosen_loc = [this.station_info[this.chosen_station].lon, 
                           this.station_info[this.chosen_station].lat]
        this.$refs.time_table.generateList()
        this.map_loading = 1
        setTimeout(() => {
          this.$refs.map.setStation()
          this.map_loading = 0
        }, 500);
      }
  }
}
</script>

<style lang="scss" scoped>
.station-container {
  padding: 32px;
  background-color: rgb(24, 39, 64);
  min-height: 700px;
}
.info-div {
  width: 50%;
  float: left;
}
.map-div {
  width: 50%;
  float: right;
}
</style>

<template>
  <div class="container">
    <div style="text-align:center;height:100%">
        <world ref="world" style="height:100%;" :settings="settings" @data="getData"/>
        <span style="position: absolute; top:2%; left:42%; font-size:35px; color:#ffffff; font-weight: bold;">
          <i class="el-icon-s-help" style="margin-right:10px" />天 算 星 座
        </span>
        <transition name="el-fade-in">
          <div class="left-div" v-if="show_sate">
            <el-card shadow="always" class="sate-card">
              <div slot="header" style="height: 10px;">
                <span style="font-size:18px; color:#409EFF;font-weight: bold;">
                  <i class="el-icon-position"/>
                  卫星状态
                </span>
              </div>
              <el-row>
                <span style="float: left; margin-top:8px">卫星名称: </span>
                <span style="float: right;">
                  <el-select v-model="settings.sate_id" placeholder="Choose your Satellite" 
                  style="width: 120px;" @change="showSate">
                  <el-option label="宝酝号" value="宝酝号"></el-option>
                  <el-option label="创星雷神号" value="创星雷神号"></el-option>
                  <el-option label="丽泽一号" value="丽泽一号"></el-option>
                  <el-option label="元光号" value="元光号"></el-option>
                  <el-option label="北邮一号" value="北邮一号"></el-option>
                </el-select>
              </span>
              </el-row>
              <el-row style="margin-top: 15px;text-align:right;">
                <span style="float: left;">当地时间: </span>
                <span style="font-size:5px;">{{data.time}}</span>
              </el-row>
              <el-row style="margin-top: 15px;text-align:right;">
                <span style="float: left;">UTC时间: </span>
                <span style="font-size:5px;">{{data.utc_time}}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-map-location" style="margin-right:5px" />纬   度: </span>
                <span style="float: right;">{{data.latitude}}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-map-location" style="margin-right:5px" />经   度：</span>
                <span style="float: right;">{{data.longitude}}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-d-caret" style="margin-right:5px" />高   度：</span>
                <span style="float: right;">{{data.altitude}} KM</span>
              </el-row>
            </el-card>
            <el-card shadow="always" class="station-card">
              <el-row>
                <span style="float: left; margin-top:8px">观测角(°)：</span>
                <el-input-number v-model="settings.cover_angle" :min="1" :max="50" style="width: 120px;" @change="clickCover">
                </el-input-number>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-pie-chart"/>
                  显示覆盖范围：</span>
                <span style="float: right;">
                  <el-switch
                    v-model="settings.show_coverage" @change="clickCover">
                  </el-switch>
                </span>
              </el-row>
              
              <el-divider></el-divider>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-alarm-clock"/>
                  设置轨迹始末时间：
                </span>
              </el-row>
              <el-row style="margin-top: 10px;">
                <div style="float: right;">
                  <span>始：</span>
                  <el-tooltip class="item" effect="dark" content="Time period before now" placement="right">
                    <el-time-picker
                      v-model="settings.time_before"
                      placeholder="time period before now"
                      style="width: 160px;" @change="clickOrbit">
                    </el-time-picker>
                  </el-tooltip>
                </div>
              </el-row>
              <el-row style="margin-top: 5px;">
                <div style="float: right;">
                  <span>末：</span>
                  <el-tooltip class="item" effect="dark" content="Time period after now" placement="right">
                    <el-time-picker
                      arrow-control
                      v-model="settings.time_after"
                      placeholder="time period after now"
                      style="width: 160px;" @change="clickOrbit">
                    </el-time-picker>
                  </el-tooltip>
                </div>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-video-camera"/>
                  显示卫星轨迹：
                </span>
                <span style="float: right;">
                  <el-switch
                    v-model="settings.show_orbit" @change="clickOrbit">
                  </el-switch>
                </span>
              </el-row>
              
              <!-- <el-row style="margin-top: 15px;">
                <el-button type="primary" plain style="width: 200px;">CHANGE SETTINGS</el-button>
              </el-row> -->
            </el-card>
          </div>
        </transition>
        
        <div class="right-div">
          <el-card shadow="always" class="console-card" style="font-family: Helvetica Neue">
            <el-row >
              <span style="float: left;">
                <i class="el-icon-position"/>
                显示卫星信息：
              </span>
              <span style="float: right;">
                <el-switch
                  v-model="show_sate" @change="showSate">
                </el-switch>
              </span>
            </el-row>
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i class="el-icon-place"/>
                显示地面站信息：
              </span>
              <span style="float: right;">
                <el-switch
                  v-model="show_station" @change="showStation">
                </el-switch>
              </span>
            </el-row>
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i class="el-icon-finished"/>
                显示运行尾迹：
              </span>
              <span style="float: right;">
                <el-switch
                  v-model="settings.tail" @change="clickCover">
                </el-switch>
              </span>
            </el-row>
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i class="el-icon-refresh-right"/>
                自动旋转：
              </span>
              <span style="float: right;">
                <el-switch
                  v-model="settings.auto_rotate" @change="clickRotate">
                </el-switch>
              </span>
            </el-row>
          </el-card>
          <transition name="el-fade-in">
            <div v-if="show_station">
            <el-card shadow="always" class="station-card" >
              <div slot="header" style="height: 10px;">
                <span style="font-size:18px; color:#409EFF;font-weight: bold;">
                  <i class="el-icon-place"/>
                  地面站信息
                </span>
              </div>
              <el-row>
                <span style="float: left; margin-top:8px">地面站名称: </span>
                <span style="float: right;">
                  <el-select placeholder="选择地面站" 
                  style="width: 120px;" v-model="station_name" @change="changeStation">
                  <el-option :label="station_info[0].station" value="0"></el-option>
                  <el-option :label="station_info[1].station" value="1"></el-option>
                  <el-option :label="station_info[2].station" value="2"></el-option>
                  <el-option :label="station_info[3].station" value="3"></el-option>
                  <el-option :label="station_info[4].station" value="4"></el-option>
                  <el-option :label="station_info[5].station" value="5"></el-option>
                  <el-option :label="station_info[6].station" value="6"></el-option>
                </el-select>
              </span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-user" style="margin-right:5px" />
                  使用方式: 
                </span>
                <span style="float: right;">{{station_info[chosen_station].cate}}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-map-location" style="margin-right:5px" />
                  纬 度: 
                </span>
                <span style="float: right;">{{station_info[chosen_station].lat}}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-map-location" style="margin-right:5px" />
                  经 度：
                </span>
                <span style="float: right;">{{station_info[chosen_station].lon}}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i class="el-icon-d-caret" style="margin-right:5px" />
                  海 拔：
                </span>
                <span style="float: right;">{{station_info[chosen_station].alt}}m</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: right;">
                  <el-button type="text" @click="jumpToDetails">详细信息</el-button>
                </span>
              </el-row>
            </el-card>
            </div>
            
          </transition>
          
        </div>
      </div>
  </div>
</template>

<script>
//import PanelGroup from './components/PanelGroup'
//import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
//import BoxCard from './components/BoxCard'
import World from './components/world'
//import Coord from './components/Coord'


export default {
  name: 'DashboardAdmin',
  components: {
    World,
  },
  mounted() {
    this.clickRotate()
  },
  data() {
    return {
      settings:{
        sate_id: "北邮一号",
        auto_rotate:true,
        tail:true,
        show_orbit:false,
        show_coverage:false,
        time_before: new Date(Date.now()-60*60*1000),
        time_after: new Date(Date.now()+60*60*1000),
        cover_angle:25,
      },

      data:{
        time:100,
        utc_time:100,
        longitude: 100.1234,
        latitude: 30.2132,
        altitude: 500,
      },

      show_sate:false,
      show_station:false,
      sate_opacity:0.7,
      station_info:[
        {station:"黑河站", lon:127.53, lat:50.22, alt:500, antenna:"Cross Yagi (UHF)", success_rate:0.85, observation:18520, cate:"部署服务器"},
        {station:"天算华东站", lon:121.39, lat:37.52, alt:47.8, antenna:"Cross Yagi (UHF)", success_rate:0.82, observation:9627, cate:"共建"},
        {station:"长沙站", lon:112.59, lat:28.12, alt:58, antenna:"Cross Yagi (UHF)", success_rate:0.79, observation:3486, cate:"部署服务器"},
        {station:"天算华南站", lon:109.45, lat:24.18, alt:150, antenna:"Cross Yagi (UHF)", success_rate:0.76, observation:14237, cate:"共享"},
        {station:"酒泉站", lon:98.50, lat:39.71, alt:1350, antenna:"Cross Yagi (UHF)", success_rate:0.89, observation:7546, cate:"部署服务器"},
        {station:"库尔勒站", lon:86.17, lat:41.72, alt:934, antenna:"Cross Yagi (UHF)", success_rate:0.88, observation:15352, cate:"部署服务器"},
        {station:"达坂城站", lon:88.31, lat:43.36, alt:1128, antenna:"Cross Yagi (UHF)", success_rate:0.86, observation:8520, cate:"部署服务器"},
      ],
      chosen_station: 0,
      station_name: "黑河站",
    }
  },
  methods: {
    clickOrbit(){
      this.$refs.world.switchOrbit()
    },
    clickCover(){
      this.$refs.world.renewData()
    },
    clickRotate(){
      if(this.settings.auto_rotate)
        this.$refs.world.rotateEarth()
      else
        this.$refs.world.stopEarth()
    },
    getData(data){
      this.data = data
    },
    showSate(){
      if(this.show_sate)
      {
        this.$refs.world.chooseSate(this.settings.sate_id)
        this.$refs.world.switchOrbit()
      }
      else
      {
        this.settings.show_orbit = false
        this.settings.show_coverage = false
        this.$refs.world.unchooseSate()
        this.$refs.world.switchOrbit()
      }
    },
    showStation(){
      if(this.show_station)
        this.$refs.world.chooseStation(this.chosen_station)
      else
        this.$refs.world.unchooseStation()
    },
    changeStation(value){
      this.chosen_station = parseInt(value)
      this.$refs.world.chooseStation(this.chosen_station)
    },
    overConsole(){
      console.log("hi")
    },
    jumpToDetails(){
      this.$router.push({ name: 'station',
                          query:{
                            chosen:this.chosen_station
                          }})
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  //background-color: rgb(240, 242, 245);
  background-color: rgb(1, 12, 24);
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
}

.left-div{
  position: absolute;
  top: 3%;
  left: 3%;
}

.right-div{
  position: absolute;
  top: 3%;
  right: 3%;
}

.sate-card {
  width: 250px;
  height: auto;
  background:#ffffff;
  opacity: 0.7;
}
.station-card {
  width: 250px;
  height: auto;
  margin-top: 20px;
  background:#ffffff;
  opacity: 0.7;
}
.console-card {
  width: 250px;
  height: auto;
  margin-top: 20px;
  background:#ffffff;
  opacity: 0.7;
}

</style>

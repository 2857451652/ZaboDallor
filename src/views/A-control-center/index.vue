<template>
  <div class="dashboard-editor-container">
    <el-row style="text-align:center;">
        <world ref="world" style="height: 700px;" :settings="settings" @data="getData"/>
        <span style="position: absolute; top:2%; left:32%; font-size:35px; color:#ffffff">
          <i class="el-icon-s-help" style="margin-right:10px" />TianSuan Constellation
        </span>
        <transition name="el-fade-in">
          <div class="left-div" v-if="show_sate">
            <el-card shadow="always" class="sate-card" :style="{'opacity':sate_opacity}">
              <div slot="header" style="height: 10px;">
                <span style="font-size:18px; color:#409EFF">
                  <i class="el-icon-position"/>
                  SATELLITE TRACKER
                </span>
              </div>
              <el-row style="">
                <span style="float: left; margin-top:8px">SATELLITE: </span>
                <span style="float: right;">
                  <el-select v-model="settings.sate_id" placeholder="Choose your Satellite" style="width: 120px;">
                  <el-option label="北邮一号" value="北邮一号"></el-option>
                  <el-option label="others" value="others"></el-option>
                </el-select>
              </span>
              </el-row>
              <el-row style="margin-top: 15px;text-align:right;">
                <span style="float: left;">LOCAL TIME: </span>
                <span style="font-size:5px;">{{data.time}}</span>
              </el-row>
              <el-row style="margin-top: 15px;text-align:right;">
                <span style="float: left;">UTC TIME: </span>
                <span style="font-size:5px;">{{data.utc_time}}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">LATITUDE: </span>
                <span style="float: right;">{{data.latitude}}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">LONGITUDE:</span>
                <span style="float: right;">{{data.longitude}}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">ALTITUDE:</span>
                <span style="float: right;">{{data.altitude}} KM</span>
              </el-row>
              <!-- <el-row style="margin-top: 15px;">
                <span style="float: left;">SPEED:</span>
                <span style="float: right;">{{data.speed}} KM/s</span>
              </el-row> -->
            </el-card>
            <el-card shadow="always" class="station-card">
              
              <el-row>
                <span style="float: left; margin-top:8px">ANGLE(°):</span>
                <el-input-number v-model="settings.cover_angle" :min="15" :max="50" style="width: 120px;" @change="clickCover">
                </el-input-number>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">SHOW COVERAGE:</span>
                <span style="float: right;">
                  <el-switch
                    v-model="settings.show_coverage" @change="clickCover">
                  </el-switch>
                </span>
              </el-row>
              
              <el-divider></el-divider>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">ORBIT PERIOD:</span>
              </el-row>
              <el-row style="margin-top: 10px;">
                <div style="float: right;">
                  <span>from </span>
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
                  <span>to </span>
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
                <span style="float: left;">SHOW ORBIT:</span>
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
                Satellite Info:
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
                Station Info:
              </span>
              <span style="float: right;">
                <el-switch
                  v-model="show_station" @change="showStation">
                </el-switch>
              </span>
            </el-row>
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i class="el-icon-refresh-left"/>
                Auto Rotate:
              </span>
              <span style="float: right;">
                <el-switch
                  v-model="settings.auto_rotate" @change="clickRotate">
                </el-switch>
              </span>
            </el-row>
          </el-card>
        </div>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import LineChart from './components/LineChart'
// import RaddarChart from './components/RaddarChart'
// import PieChart from './components/PieChart'
// import BarChart from './components/BarChart'
// import TransactionTable from './components/TransactionTable'
// import TodoList from './components/TodoList'
import BoxCard from './components/BoxCard'
import World from './components/world'
import Coord from './components/Coord'


export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    LineChart,
    World,
    Coord,
    BoxCard,
  },
  data() {
    return {
      settings:{
        sate_id: "北邮一号",
        auto_rotate:true,
        show_orbit:false,
        show_coverage:true,
        time_before: new Date(),
        time_after: new Date(Date.now()+60*60*1000),
        cover_angle:25,
      },

      data:{
        time:100,
        utc_time:100,
        longitude: 100.1234,
        latitude: 30.2132,
        altitude: 500,
        speed:420,
      },

      show_sate:true,
      show_station:false,
      sate_opacity:0.7,
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
    },
    showStation(){
    },
    overConsole(){
      console.log("hi")
    }
  }
}
</script>

<style lang="scss">
.dashboard-editor-container {
  //background-color: rgb(240, 242, 245);
  background-color: rgb(1, 12, 24);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #ffffff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
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
  font-family: 'Helvetica Neue';
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

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

<template>
  <div class="container">
    <div style="text-align:center;height:100%">
      <el-button
        v-if="showBigData"
        type="primary"
        plain
        style="width: 150px; height: 40px; position:absolute; right:15px; bottom:25px; font-weight: bold;"
        @click="backToMain"
      >
        <i class="el-icon-back" /> 返回天算星座
      </el-button>
      <iframe
        v-if="showBigData"
        src="http://www.tiansuan.site"
        width="100%"
        height="100%"
        scrolling="auto"
      />


      <world
        ref="world"
        style="height:100%;"
        :settings="settings"
        @data="getData"
        @zoom-event="zoomTo"
      />
      <span
        v-if="!showBigData"
        style="position: absolute; top:2%; left:42%; font-size:35px; color:#ffffff; font-weight: bold;"
      >
        <i
          class="el-icon-s-help"
          style="margin-right:10px"
        />天 算 星 座
      </span>
      <span
        v-if="showBigData"
        style="position: absolute; top:2%; left:36%; font-size:35px; color:#ffffff; font-weight: bold;"
      >
        <i
          class="el-icon-s-help"
          style="margin-right:10px"
        />天 算 大 数 据 平 台
      </span>
      <transition name="el-fade-in">
        <div
          v-if="show_sate&&!showBigData"
          class="left-div"
        >
          <el-card
            shadow="always"
            class="sate-card"
          >
            <div
              slot="header"
              style="height: 10px;"
            >
              <span style="font-size:18px; color:#409EFF;font-weight: bold;">
                <i class="el-icon-position" />
                卫星状态
              </span>
            </div>
            <el-row>
              <span style="float: left; margin-top:8px">卫星名称: </span>
              <span style="float: right;">
                <el-select
                  v-model="settings.sate_id"
                  placeholder="Choose your Satellite"
                  style="width: 120px;"
                  @change="showSate"
                >
                  <el-option
                    label="天仪33卫星"
                    value="天仪33卫星"
                  />
                  <el-option
                    label="丽泽一号"
                    value="丽泽一号"
                  />
                  <el-option
                    label="宝酝号"
                    value="宝酝号"
                  />
                  <el-option
                    label="创星雷神号"
                    value="创星雷神号"
                  />
                  <el-option
                    label="元光号"
                    value="元光号"
                  />
                  <el-option
                    label="北邮一号"
                    value="北邮一号"
                  />
                  <el-option
                    label="北邮二号"
                    value="北邮二号"
                  />
                  <el-option
                    label="北邮三号"
                    value="北邮三号"
                  />
                  <el-option
                    label="天算9号"
                    value="天算9号"
                  />
                  <el-option
                    label="天算10号"
                    value="天算10号"
                  />
                  <el-option
                    label="天算11号"
                    value="天算11号"
                  />
                  <el-option
                    label="天算12号"
                    value="天算12号"
                  />
                  <el-option
                    label="天算13号"
                    value="天算13号"
                  />
                  <el-option
                    label="天算14号"
                    value="天算14号"
                  />
                  <el-option
                    label="天算15号"
                    value="天算15号"
                  />
                  <el-option
                    label="天算16号"
                    value="天算16号"
                  />
                  <el-option
                    label="天算17号"
                    value="天算17号"
                  />
                  <el-option
                    label="天算18号"
                    value="天算18号"
                  />
                  <el-option
                    label="天算19号"
                    value="天算19号"
                  />
                  <el-option
                    label="天算20号"
                    value="天算20号"
                  />
                  <el-option
                    label="天算21号"
                    value="天算21号"
                  />
                  <el-option
                    label="天算22号"
                    value="天算22号"
                  />
                  <el-option
                    label="天算23号"
                    value="天算23号"
                  />
                  <el-option
                    label="天算24号"
                    value="天算24号"
                  />
                  <el-option
                    label="天算25号"
                    value="天算25号"
                  />
                  <el-option
                    label="天算26号"
                    value="天算26号"
                  />
                  <el-option
                    label="天算27号"
                    value="天算27号"
                  />
                  <el-option
                    label="天算28号"
                    value="天算28号"
                  />
                  <el-option
                    label="天算29号"
                    value="天算29号"
                  />
                </el-select>
              </span>
            </el-row>
            <el-row style="margin-top: 15px;text-align:right;">
              <span style="float: left;">当地时间: </span>
              <span style="font-size:10px;">{{ data.time }}</span>
            </el-row>
            <el-row style="margin-top: 15px;text-align:right;">
              <span style="float: left;">UTC时间: </span>
              <span style="font-size:12px;">{{ data.utc_time }}</span>
            </el-row>
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i
                  class="el-icon-map-location"
                  style="margin-right:5px"
                />纬   度: </span>
              <span style="float: right;">{{ data.latitude }}</span>
            </el-row>
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i
                  class="el-icon-map-location"
                  style="margin-right:5px"
                />经   度：</span>
              <span style="float: right;">{{ data.longitude }}</span>
            </el-row>
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i
                  class="el-icon-d-caret"
                  style="margin-right:5px"
                />高   度：</span>
              <span style="float: right;">{{ data.altitude }} KM</span>
            </el-row>
          </el-card>
          <el-card
            shadow="always"
            class="station-card"
          >
            <el-row>
              <span style="float: left; margin-top:8px">观测角(°)：</span>
              <el-input-number
                v-model="settings.cover_angle"
                :min="1"
                :max="50"
                style="width: 120px;"
                @change="clickCover"
              />
            </el-row>
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i class="el-icon-pie-chart" />
                显示覆盖范围：</span>
              <span style="float: right;">
                <el-switch
                  v-model="settings.show_coverage"
                  @change="clickCover"
                />
              </span>
            </el-row>

            <el-divider />
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i class="el-icon-alarm-clock" />
                设置轨迹始末时间：
              </span>
            </el-row>
            <el-row style="margin-top: 10px;">
              <div style="float: right;">
                <span>始：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Time period before now"
                  placement="right"
                >
                  <el-time-picker
                    v-model="settings.time_before"
                    placeholder="time period before now"
                    style="width: 160px;"
                    @change="clickOrbit"
                  />
                </el-tooltip>
              </div>
            </el-row>
            <el-row style="margin-top: 5px;">
              <div style="float: right;">
                <span>末：</span>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="Time period after now"
                  placement="right"
                >
                  <el-time-picker
                    v-model="settings.time_after"
                    arrow-control
                    placeholder="time period after now"
                    style="width: 160px;"
                    @change="clickOrbit"
                  />
                </el-tooltip>
              </div>
            </el-row>
            <el-row style="margin-top: 15px;">
              <span style="float: left;">
                <i class="el-icon-video-camera" />
                显示卫星轨迹：
              </span>
              <span style="float: right;">
                <el-switch
                  v-model="settings.show_orbit"
                  @change="clickOrbit"
                />
              </span>
            </el-row>

            <!-- <el-row style="margin-top: 15px;">
                <el-button type="primary" plain style="width: 200px;">CHANGE SETTINGS</el-button>
              </el-row> -->
          </el-card>
        </div>
      </transition>

      <div class="right-div">
        <el-card
          v-if="!showBigData"
          shadow="always"
          class="console-card"
          style="font-family: Helvetica Neue"
        >
          <el-row>
            <span style="float: left;">
              <i class="el-icon-position" />
              显示卫星信息：
            </span>
            <span style="float: right;">
              <el-switch
                v-model="show_sate"
                @change="showSate"
              />
            </span>
          </el-row>
          <el-row style="margin-top: 15px;">
            <span style="float: left;">
              <i class="el-icon-place" />
              显示地面站信息：
            </span>
            <span style="float: right;">
              <el-switch
                v-model="show_station"
                @change="showStation"
              />
            </span>
          </el-row>
          <el-row style="margin-top: 15px;">
            <span style="float: left;">
              <i class="el-icon-finished" />
              显示运行尾迹：
            </span>
            <span style="float: right;">
              <el-switch
                v-model="settings.tail"
                @change="clickCover"
              />
            </span>
          </el-row>
          <el-row style="margin-top: 15px;">
            <span style="float: left;">
              <i class="el-icon-refresh-right" />
              自动旋转：
            </span>
            <span style="float: right;">
              <el-switch
                v-model="settings.auto_rotate"
                @change="clickRotate"
              />
            </span>
          </el-row>
        </el-card>
        <el-card
          v-if="!showBigData"
          shadow="always"
          class="station-card"
          style="font-family: Helvetica Neue"
        >
          <el-row style="">
            <el-button
              type="info"
              style="width: 150px; height: 40px;font-weight: bold;"
              icon="el-icon-link"
              @click="toOrbit"
            >
              航天运管系统
            </el-button>
            <el-tooltip
              class="item"
              effect="dark"
              content="卫星应用部署"
              placement="top"
            >
              <el-button
                type="info"
                plain
                icon="el-icon-menu"
                circle
                @click="toApp"
              />
            </el-tooltip>
          </el-row>
        </el-card>
        <transition name="el-fade-in">
          <div v-if="show_station&&!showBigData">
            <el-card
              shadow="always"
              class="station-card"
            >
              <div
                slot="header"
                style="height: 10px;"
              >
                <span style="font-size:18px; color:#409EFF;font-weight: bold;">
                  <i class="el-icon-place" />
                  地面站信息
                </span>
              </div>
              <el-row>
                <span style="float: left; margin-top:8px">地面站名称: </span>
                <span style="float: right;">
                  <el-select
                    v-model="station_name"
                    placeholder="选择地面站"
                    style="width: 120px;"
                    @change="changeStation"
                  >
                    <el-option
                      :label="station_info[0].station"
                      value="0"
                    />
                    <el-option
                      :label="station_info[1].station"
                      value="1"
                    />
                    <el-option
                      :label="station_info[2].station"
                      value="2"
                    />
                    <el-option
                      :label="station_info[3].station"
                      value="3"
                    />
                    <el-option
                      :label="station_info[4].station"
                      value="4"
                    />
                    <el-option
                      :label="station_info[5].station"
                      value="5"
                    />
                    <el-option
                      :label="station_info[6].station"
                      value="6"
                    />
                  </el-select>
                </span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i
                    class="el-icon-user"
                    style="margin-right:5px"
                  />
                  使用方式:
                </span>
                <span style="float: right;">{{ station_info[chosen_station].cate }}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i
                    class="el-icon-map-location"
                    style="margin-right:5px"
                  />
                  纬 度:
                </span>
                <span style="float: right;">{{ station_info[chosen_station].lat }}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i
                    class="el-icon-map-location"
                    style="margin-right:5px"
                  />
                  经 度：
                </span>
                <span style="float: right;">{{ station_info[chosen_station].lon }}</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: left;">
                  <i
                    class="el-icon-d-caret"
                    style="margin-right:5px"
                  />
                  海 拔：
                </span>
                <span style="float: right;">{{ station_info[chosen_station].alt }}m</span>
              </el-row>
              <el-row style="margin-top: 15px;">
                <span style="float: right;">
                  <el-button
                    type="text"
                    @click="jumpToDetails"
                  >详细信息</el-button>
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
import World from './components/world'


export default {
  name: 'SatOrbit',
  components: {
    World,
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
      orbit_show_list: {
                "天仪33卫星":false,"丽泽一号":false,"宝酝号":false,"创星雷神号":false,"元光号":false,
                "北邮一号":false,"天算9号":false,"天算10号":false,"天算11号":false,"天算12号":false,
                "天算13号":false,"天算14号":false,"天算15号":false,"天算16号":false,"天算17号":false,
                "天算18号":false,"天算19号":false,"天算20号":false,"天算21号":false,"天算22号":false,
                "天算23号":false,"天算24号":false,"天算25号":false,"天算26号":false,"天算27号":false,
                "天算28号":false,"天算29号":false,"天算30号":false,"天算31号":false,
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
        {station:"天算华东站", lon:121.39, lat:37.52, alt:47.8, antenna:"Cross Yagi (UHF)", success_rate:0.82, observation:9627, cate:"共建"},
        {station:"北京", lon:116.20, lat:39.54, alt:47.8, antenna:"Cross Yagi (UHF)", success_rate:0.90, observation:2453, cate:"大数据分析"},
        {station:"黑河站", lon:127.53, lat:50.22, alt:500, antenna:"Cross Yagi (UHF)", success_rate:0.85, observation:18520, cate:"部署服务器"},
        {station:"长沙站", lon:112.59, lat:28.12, alt:58, antenna:"Cross Yagi (UHF)", success_rate:0.79, observation:3486, cate:"部署服务器"},
        {station:"天算华南站", lon:109.45, lat:24.18, alt:150, antenna:"Cross Yagi (UHF)", success_rate:0.76, observation:14237, cate:"共享"},
        {station:"酒泉站", lon:98.50, lat:39.71, alt:1350, antenna:"Cross Yagi (UHF)", success_rate:0.89, observation:7546, cate:"部署服务器"},
        {station:"库尔勒站", lon:86.17, lat:41.72, alt:934, antenna:"Cross Yagi (UHF)", success_rate:0.88, observation:15352, cate:"部署服务器"},
        {station:"达坂城站", lon:88.31, lat:43.36, alt:1128, antenna:"Cross Yagi (UHF)", success_rate:0.86, observation:8520, cate:"部署服务器"},
      ],
      chosen_station: 0,
      station_name: "天算华东站",
      showBigData:false,
    }
  },
  mounted() {
    this.clickRotate()
  },
  methods: {
    toOrbit(){
      this.$router.push({ name: 'orbit' })
    },
    toApp(){
      this.$router.push({ name: 'appctl' })
    },
    clickOrbit(){
      // this.$refs.world.switchOrbit()
      this.orbit_show_list[this.settings.sate_id] = this.settings.show_orbit
      this.$refs.world.chooseOrbit(this.settings.show_orbit, this.settings.sate_id)
      console.log("clicked orbit", this.settings.show_orbit, this.settings.sate_id)
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
        this.settings.show_orbit = this.orbit_show_list[this.settings.sate_id]
        this.$refs.world.chooseSate(this.settings.sate_id)
        this.$refs.world.chooseOrbit(this.settings.show_orbit, this.settings.sate_id)
      }
      else
      {
        this.settings.show_coverage = false
        this.$refs.world.unchooseSate()
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
    zoomTo(data){
      this.$refs.world.zoomSpace(data.coord[0], data.coord[1])
      if(data.name=="北京大数据分析"){
        this.timer2 = setTimeout(() => {
          this.showBigData = true
        }, 300)
      }
      else if(data.name=="天算华东站"){
        this.timer2 = setTimeout(() => {
          this.$router.push({ name: 'monitor' })
        }, 300)
      }
    },
    // zoomToBeijing(){
    //   this.$refs.world.zoomSpace(116.20, 39.54)
    //   this.timer2 = setTimeout(() => {
    //     this.showBigData = true
    //   }, 300)
    // },
    backToMain(){
      this.showBigData = false
      this.$refs.world.backToNorm()
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
  position: absolute;
  height: 100%; /* 设置高度为视口高度的100% */
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
  margin-top: 20%;
  background:#ffffff;
  opacity: 0.7;
}
.station-card {
  width: 250px;
  height: auto;
  margin-top: 10%;
  background:#ffffff;
  opacity: 0.7;
}
.console-card {
  width: 250px;
  height: auto;
  margin-top: 20%;
  background:#ffffff;
  opacity: 0.7;
}

</style>

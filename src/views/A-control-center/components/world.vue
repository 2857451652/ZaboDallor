<template>
  <div ref="refChart"/>
</template>

<script>
// 首先引入三个包
import * as echarts from 'echarts'
import 'echarts-gl'
import axios from "axios";
import { len } from 'echarts-gl';
import world from 'echarts/map/js/world.js'
import satellite from 'satellite.js/dist/satellite.js';
import { log } from 'three';


export default {
  props:{
    "settings":Object
  },
  data() {
    return {
      // 地球必需图片，可以去echarts官网下载
      baseTexture: require('@/assets/images/world.jpg'),
      heightTexture: require('@/assets/images/world.jpg'),
      night: require('@/assets/images/night.jpg'),
      cloud: require('@/assets/images/clouds2.png'),
      stars: require('@/assets/images/starfield.jpg'),
      //pisa: require('@/assets/pisa.hdr'),
      tail_track: [],
      sate_orbit: [],
      sate_pos: [],
      myChart: null,
      orbit_show: false,
      orbit_data: {
                "天仪33卫星":{"show":false, "orbit":[]},
                "丽泽一号":{"show":false, "orbit":[]},
                "宝酝号":{"show":false, "orbit":[]},
                "创星雷神号":{"show":false, "orbit":[]},
                "元光号":{"show":false, "orbit":[]},
                "北邮一号":{"show":false, "orbit":[]},
                "天算9号":{"show":false, "orbit":[]},
                "天算10号":{"show":false, "orbit":[]},
                "天算11号":{"show":false, "orbit":[]},
                "天算12号":{"show":false, "orbit":[]},
                "天算13号":{"show":false, "orbit":[]},
                "天算14号":{"show":false, "orbit":[]},
                "天算15号":{"show":false, "orbit":[]},
                "天算16号":{"show":false, "orbit":[]},
                "天算17号":{"show":false, "orbit":[]},
                "天算18号":{"show":false, "orbit":[]},
                "天算19号":{"show":false, "orbit":[]},
                "天算20号":{"show":false, "orbit":[]},
                "天算21号":{"show":false, "orbit":[]},
                "天算22号":{"show":false, "orbit":[]},
                "天算23号":{"show":false, "orbit":[]},
                "天算24号":{"show":false, "orbit":[]},
                "天算25号":{"show":false, "orbit":[]},
                "天算26号":{"show":false, "orbit":[]},
                "天算27号":{"show":false, "orbit":[]},
                "天算28号":{"show":false, "orbit":[]},
                "天算29号":{"show":false, "orbit":[]},
                "天算30号":{"show":false, "orbit":[]},
                "天算31号":{"show":false, "orbit":[]},
                },
      user_loc:[],
      sate_TLE:{
                "天仪33卫星":
                  ["1 60480U 24149N   25109.18258403  .00015685  00000+0  59424-3 0  9997",
                  "2 60480  97.4078 187.7014 0003839 334.1511  25.9535 15.26981891 37328"],
                // "丽泽一号":
                //   ["1 60481U 24149P   25109.15913814  .00015085  00000+0  58450-3 0  9991",
                //   "2 60481  97.4103 187.6815 0002894 338.7467  21.3651 15.26245921 37311"],
                "宝酝号":
                  ["1 60482U 24149Q   25109.64573328  .00033802  00000+0  68296-3 0  9994",
                  "2 60482  97.4081 192.4427 0001211 244.3500 115.7624 15.46416707 37673"],
                "创星雷神号":
                  ["1 51830U 22019G   23108.33984188  .00023628  00000+0  11562-2 0  9996",
                  "2 51830  97.4745 182.8795 0012911 276.1911  83.7852 15.18120099 62755"],
                "元光号":
                  ["1 60519U 24149BD  25109.68361934  .00017410  00000+0  62515-3 0  9992",
                  "2 60519  97.4077 188.6980 0005597  17.1409 343.0019 15.28720702 37436"],
                "北邮一号":
                  ["1 55261U 23007P   23093.85628476  .00018574  00000+0  65276-3 0  9997",
                  "2 55261  97.3598 167.3962 0009698  41.8613  69.7682 15.29378720 12017"],
                
                // "天仪33卫星":
                //   ["1 60514U 24149AY  25109.20632683  .00016207  00000+0  60915-3 0  9992",
                //   "2 60514  97.4122 188.0948 0003463  33.5530 326.5927 15.27237850 37347"],
                "丽泽一号":
                  ["1 60515U 24149AZ  25109.17277742  .00014146  00000+0  53774-3 0  9995",
                  "2 60515  97.4068 187.8194 0004969  20.2633 339.8802 15.26887791 37338"],
                // "宝酝号":
                //   ["1 60516U 24149BA  25109.18796059  .00013567  00000+0  52011-3 0  9993",
                //   "2 60516  97.4126 187.9891 0004083  30.2501 329.8973 15.26619917 37332"],
                // "创星雷神号":
                //   ["1 60517U 24149BB  25109.89723256  .00015206  00000+0  57146-3 0  9997",
                //   "2 60517  97.4054 188.6717 0005244  18.0072 342.1351 15.27250474 37456"],
                // "元光号":
                //   ["1 60518U 24149BC  25109.19474084  .00015415  00000+0  56853-3 0  9999",
                //   "2 60518  97.4108 188.2450 0004619  20.0630 340.0790 15.27870892 37350"],
                // "北邮一号":
                //   ["1 60519U 24149BD  25109.68361934  .00017410  00000+0  62515-3 0  9992",
                //   "2 60519  97.4077 188.6980 0005597  17.1409 343.0019 15.28720702 37436"],

                "天算9号":
                  ["1 60480U 24149N   25109.18258403  .00015685  00000+0  59424-3 0  9997",
                  "2 60480  97.4078 187.7014 0003839 334.1511  25.9535 15.26981891 37328"],
                "天算10号":
                  ["1 60481U 24149P   25109.15913814  .00015085  00000+0  58450-3 0  9991",
                  "2 60481  97.4103 187.6815 0002894 338.7467  21.3651 15.26245921 37311"],
                "天算11号":
                  ["1 60482U 24149Q   25109.64573328  .00033802  00000+0  68296-3 0  9994",
                  "2 60482  97.4081 192.4427 0001211 244.3500 115.7624 15.46416707 37673"],
                "天算12号":
                  ["1 60483U 24149R   25109.76633660  .00016118  00000+0  61118-3 0  9991",
                  "2 60483  97.4099 188.3518 0002370 336.8309  23.2823 15.26950076 37415"],
                "天算13号":
                  ["1 60484U 24149S   25109.65097767  .00013901  00000+0  53282-3 0  9992",
                  "2 60484  97.4072 188.1071 0003098 337.2875  22.8226 15.26623635 37397"],
                "天算14号":
                  ["1 60486U 24149U   25109.19042093  .00016147  00000+0  59916-3 0  9990",
                  "2 60486  97.4077 187.8283 0004153 346.8791  13.2340 15.27662023 37331"],
                "天算15号":
                  ["1 60487U 24149V   25109.20520939  .00013547  00000+0  52464-3 0  9995",
                  "2 60487  97.4127 187.8310 0002059 345.6922  14.4258 15.26289451 37324"],
                "天算16号":
                  ["1 60488U 24149W   25109.17781865  .00018583  00000+0  68889-3 0  9992",
                  "2 60488  97.4126 188.0141 0002897 347.7107  12.4061 15.27667430 37336"],
                "天算17号":
                  ["1 60489U 24149X   25109.16182556  .00013547  00000+0  53063-3 0  9997",
                  "2 60489  97.4050 187.4910 0003515 343.1326  16.9795 15.25907430 37317"],
                "天算18号":
                  ["1 60490U 24149Y   25109.65345980  .00013029  00000+0  51444-3 0  9991",
                  "2 60490  97.4122 188.1237 0003326 347.9186  12.1972 15.25649139 37386"],
                "天算19号":
                  ["1 60491U 24149Z   25109.61507637  .00013371  00000+0  50747-3 0  9992",
                  "2 60491  97.4057 188.1068 0003680 348.5898  11.5257 15.26959643 37391"],
                "天算20号":
                  ["1 60492U 24149AA  25109.79972336  .00014163  00000+0  54708-3 0  9995",
                  "2 60492  97.4123 188.4118 0002471 345.7601  14.3568 15.26363006 37414"],
                "天算21号":
                  ["1 60494U 24149AC  25109.22245016  .00014811  00000+0  56355-3 0  9993",
                  "2 60494  97.4070 187.7650 0004639 355.3216   4.7979 15.26847644 37332"],
                "天算22号":
                  ["1 60495U 24149AD  25109.20444437  .00014917  00000+0  55205-3 0  9990",
                  "2 60495  97.4115 187.9501 0004027   4.9402 355.1876 15.27767381 37334"],
                "天算23号":
                  ["1 60497U 24149AF  25109.17197774  .00015184  00000+0  57013-3 0  9993",
                  "2 60497  97.4060 187.7869 0003882 352.3069   7.8110 15.27284380 37332"],
                "天算24号":
                  ["1 60499U 24149AH  25109.18281026  .00015238  00000+0  57211-3 0  9990",
                  "2 60499  97.4134 188.0187 0003073 358.6920   1.4311 15.27290367 36716"],
                "天算25号":
                  ["1 60501U 24149AK  25109.17337724  .00014966  00000+0  55841-3 0  9994",
                  "2 60501  97.4050 187.7827 0004174 357.1320   2.9894 15.27495930 37339"],
                "天算26号":
                  ["1 60502U 24149AL  25109.18715373  .00013347  00000+0  51838-3 0  9990",
                  "2 60502  97.4065 187.6567 0004322   7.6657 352.4646 15.26191410 37323"],
                "天算27号":
                  ["1 60503U 24149AM  25109.16832632  .00014379  00000+0  55242-3 0  9996",
                  "2 60503  97.4113 187.8583 0002775   8.4813 351.6472 15.26539979 37325"],
                "天算28号":
                  ["1 60505U 24149AP  25109.65112174  .00014927  00000+0  55376-3 0  9991",
                  "2 60505  97.4057 188.3684 0004389   6.1412 353.9880 15.27686272 37413"],
                "天算29号":
                  ["1 60511U 24149AV  25108.76339826  .00017439  00000+0  62331-3 0  9994",
                  "2 60511  97.4137 187.9869 0003264  21.9239 338.2140 15.28880621 37298"],
                "天算30号":
                  ["1 60512U 24149AW  25109.22183730  .00016658  00000+0  60832-3 0  9994",
                  "2 60512  97.4048 188.0057 0004569   6.7117 353.4183 15.28180014 37358"],
                "天算31号":
                  ["1 60513U 24149AX  25109.67016442  .00011261  00000+0  44703-3 0  9993",
                  "2 60513  97.4145 188.3105 0004680  27.9083 332.2405 15.25500856 37398"],
                },
      station_loc:[
        [121.39, 37.52, 300, "天算华东站"],
        [116.20, 39.54, 300, "北京大数据分析"],
        [127.53, 50.22, 300, "黑河站"],
        [112.59, 28.12, 300, "长沙站"],
        [109.45, 24.18, 300, "天算华南站"],
        [98.50, 39.71, 300, "酒泉站"],
        [86.17, 41.72, 300, "库尔勒站"],
        [88.31, 43.36, 300, "达坂城站"],
      ],
      chosen_sate: "",
      chosen_index:-1,
      chosen_station:-1,
      chosen_coord:[115, 40],
      rotate:this.settings.autoRotate,
      base_height: 300,
      timer1:NaN,
      timer2:NaN,
      
      data:{
        time:100,
        utc_time:100,
        longitude: 100.1234,
        latitude: 30.2132,
        altitude: 500,
        speed:420,
      },
    }
  },
  // beforeRouteEnter(to, from, next) {
  //   next();
  // },
  mounted() {
    this.init();
    window.addEventListener('resize', this.handleResize);
  },
  destroyed() {
    clearInterval(this.timer1)
    clearInterval(this.timer2)
    window.removeEventListener('resize', this.handleResize);
    echarts.dispose(this.myChart)
    console.log("cleared")
  },
  methods: {
    handleResize(){
      this.myChart.resize();
    },
    init() {
      console.log("comming")
      this.myChart = echarts.init(this.$refs.refChart)
      this.myChart.setOption({
        backgroundColor: '#000',
        title: {
          show: true
        },
        geo: {
          type: 'map',
          map: world,
          boundingCoords: [
            [-180, 90],
            [180, -90]
          ],
          zoom: 0,
          roam: false,
          itemStyle: {
            borderColor: '#000d2d',
            normal: {
              areaColor: '#2455ad',
              borderColor: '#000c2d'
            },
            emphasis: {
              areaColor: '#357cf8'
            }
          },
          label: {
            fontSize: 24
          },
        }
        // series: dser,
      })
      var option = {
        backgroundColor: 'rgba(0,0,0,0)', // canvas的背景颜色
        globe: [{
          show: true,
          baseTexture: this.baseTexture,
          heightTexture: this.heightTexture,
          displacementScale: 0.04,
          environment: this.stars,
          shading: 'realistic',
          realisticMaterial: {
            roughness: 0.9
          },
          light: {
            main: {
              intensity: 3,
              shadow: true,
            },
            ambient:{
              intensity:0.3
            }
          },
          postEffect: {
            enable: true,
          },
          top: 'middle',
          left: 'center',
          globeRadius: 120,
          globeOuterRadius: 150,
          viewControl: {
            distance: 240,
            autoRotate: this.rotate
          },
          layers: [
            {
              type: 'blend',
              blendTo: 'emission',
              texture: this.night
            },
            // {
            //   type: 'overlay',
            //   texture: this.cloud,
            //   shading: 'lambert',
            //   distance: 5
            // }
          ]
        }],
      }

      this.myChart.setOption(option)
      this.renewData()
      this.setSateToCenter()
      let that = this
      this.myChart.on('click', function (params) {
        if(params.data[3]=="北京大数据分析"){
          // that.zoomSpace(params.data[0], params.data[1])
          that.$emit('zoom-event', {name:"北京大数据分析",coord:[params.data[0], params.data[1]]});
        }
        else if(params.data[3]=="天算华东站"){
          // that.zoomSpace(params.data[0], params.data[1])
          that.$emit('zoom-event', {name:"天算华东站",coord:[params.data[0], params.data[1]]});
        }
        else{
          that.setSateToCenter([params.data[0], params.data[1]])
        }
      });
      this.timer1 = setInterval(() => {
        this.renewData()
      }, 15000)
      this.timer2 = setInterval(() => {
        this.updateData()
      }, 1000)
    },
    stopEarth(){
      var option = this.myChart.getOption()
      option.globe[0].viewControl.autoRotate = false
      this.rotate = false
      this.myChart.setOption(option)
    },
    rotateEarth(){
      var option = this.myChart.getOption()
      option.globe[0].viewControl.autoRotate = true
      this.rotate = true
      this.myChart.setOption(option)
    },
    getCircleArea(place, angle) {
      var lon=place[0], lat=place[1], alti=place[2];
      var cot = Math.cos(Math.PI*angle/180)/Math.sin(Math.PI*angle/180)
      var r = alti * cot, R = 6371;
      // generate a circle
      var sample_rate = 64, i=0;
      var circle = [];
      
      var f0, x0, y0, z0;
      var a, a_lat = Math.PI/2 - Math.PI*lat/180, a_lon = Math.PI + Math.PI*lon/180;
      var point_lon, point_lat;
      for(i=0; i<=sample_rate; i++){
        a = 2*Math.PI*i/sample_rate
        f0 = Math.asin(r/R)
        x0 = Math.sin(f0)*Math.cos(a)
        y0 = Math.sin(f0)*Math.sin(a)
        z0 = Math.cos(f0)
        var vector = [x0, y0, z0]
        vector = this.rotateVector('y', a_lat, vector)
        vector = this.rotateVector('z', a_lon, vector)
        point_lat = 90 - Math.acos(vector[2])*180/Math.PI
        var lon_angle = Math.atan(vector[1]/vector[0])
        if(vector[0]<0)
          lon_angle += Math.PI
        point_lon = -180 + lon_angle*180/Math.PI
        circle.push([point_lon, point_lat, this.base_height])
      }
      return [circle]
    },
    rotateVector(axis, a, vector){
      var matrix = []
      if(axis == 'z'){
        matrix = [
          [Math.cos(a), -Math.sin(a), 0],
          [Math.sin(a), Math.cos(a), 0],
          [0, 0, 1],
        ]
      }
      else if(axis == 'y'){
        matrix = [
          [Math.cos(a), 0, Math.sin(a)],
          [0, 1, 0],
          [-Math.sin(a), 0, Math.cos(a)],
        ]
      }
      var i, j, vector_new = [];
      for(i=0; i<3; i++){
        var value=0;
        for(j=0; j<3; j++){
          value += matrix[i][j] * vector[j]
        }
        vector_new.push(value)
      }
      return vector_new
    },
    getOrbitPoint(tle, time) {
      // Sample TLE
      var tleLine1 = tle[0],
          tleLine2 = tle[1];
      
      // 初始化一条卫星记录
      var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

      //  或者你可以使用JavaScript日期
      var positionAndVelocity = satellite.propagate(satrec, time);
      if(positionAndVelocity[0]==false)
        console.log(tle)

      var positionEci = positionAndVelocity.position;

      // 将GMT中国时、Julindate时转成格林尼治恒星时
      var gmst = satellite.gstime(time);

      // 你可以得到ECF，大地测量，观察角度和多普勒因子。
      var positionGd = satellite.eciToGeodetic(positionEci, gmst);

      // 通过'经度'，'纬度'，'高度'访问大地坐标。
      var longitude = positionGd.longitude,
          latitude  = positionGd.latitude,
          height    = positionGd.height;

      //  将弧度转换为度。
      var longitude = satellite.degreesLong(longitude),
          latitude  = satellite.degreesLat(latitude);

      return [longitude, latitude, height]
    },
    getTailTrack(tle, now_time) {
      var orbitData = [];
      var i;
      for(i=5*60; i>=0; i-=10)  // 10 seconds gap
      {
        var time = new Date(now_time-(i*1000));
        var point = this.getOrbitPoint(tle, time)
        orbitData.push(point)
      }
      return [orbitData]
    },
    switchOrbit(show) {
      // var start_time = this.settings.time_before
      // var end_time = this.settings.time_after
      // var tle = this.sate_TLE[this.chosen_sate]
      // if(this.settings.show_orbit){
      //   var time_period = (end_time - start_time)/1000
      //   if(time_period < 0){
      //     time_period += 24*60*60
      //   }

      //   var orbitData = [];
      //   var i;
      //   for(i=time_period; i>=0; i-=30)  // 10 seconds gap
      //   {
      //     var time = new Date(end_time-(i*1000));
      //     var point = this.getOrbitPoint(tle, time)
      //     orbitData.push(point)
      //   }
      //   this.sate_orbit = [orbitData]
      //   this.orbit_show = true
      //   this.renewData()
      // }
      // else{
      //   this.orbit_show = false
      //   this.renewData()
      // }
      this.orbit_show = show
    },
    chooseOrbit(turn_on, selected_sate) {
      var start_time = this.settings.time_before
      var end_time = this.settings.time_after
      var tle = this.sate_TLE[selected_sate]
      if(turn_on){
        var time_period = (end_time - start_time)/1000
        if(time_period < 0){
          time_period += 24*60*60
        }

        var orbitData = [];
        var i;
        for(i=time_period; i>=0; i-=30)  // 10 seconds gap
        {
          var time = new Date(end_time-(i*1000));
          var point = this.getOrbitPoint(tle, time)
          orbitData.push(point)
        }
        this.orbit_data[selected_sate]["show"] = true
        this.orbit_data[selected_sate]["orbit"] = [orbitData]
        console.log("set orbit data", this.orbit_data[selected_sate])
        this.renewData()
      }
      else{
        this.orbit_data[selected_sate]["show"] = false
        this.renewData()
      }
    },
    chooseSate(sate_id){
      this.chosen_sate = sate_id
      this.renewData()
      this.setSateToCenter(this.chosen_coord)
    },
    unchooseSate(){
      this.chosen_sate = ""
      this.chosen_index = -1
      this.renewData()
    },
    chooseStation(id){
      this.chosen_station = id
      this.renewData()
      this.setSateToCenter([this.station_loc[id][0], this.station_loc[id][1]])
    },
    zoomSpace(lon, lat){
      var option = this.myChart.getOption()
      var set_center = {
        globe:{
          viewControl:{
            targetCoord: [lon, lat],
            distance: 10,
            autoRotate:false,
          }
        }
      }
      this.myChart.setOption(set_center)
      this.myChart.setOption(option)
    },
    backToNorm(){
      var option = this.myChart.getOption()
      var set_center = {
        globe:{
          viewControl:{
            distance: 240,
            autoRotate:true,
          }
        }
      }
      this.myChart.setOption(set_center)
      this.myChart.setOption(option)
    },
    unchooseStation(){
      this.chosen_station = -1
      this.renewData()
    },
    setSateToCenter(chosen_coord){
      var option = this.myChart.getOption()
      var set_center = {
        globe:{
          viewControl:{
            targetCoord: chosen_coord,
          }
        }
      }
      this.myChart.setOption(set_center)
      this.myChart.setOption(option)
      
    },
    renewBaseHeight(){
      for(var i=0; i<this.station_loc.length; i++){
        this.station_loc[i][2] = this.base_height;
      }
    },
    updateData() {
      if(this.chosen_sate != "")
      {
        var time = new Date()
        var data = {}
        var tle = this.sate_TLE[this.chosen_sate]
        var place = this.getOrbitPoint(tle, time)
        data.time = time.toString()
        data.utc_time = time.toUTCString()
        data.longitude = place[0].toFixed(4)
        data.latitude = place[1].toFixed(4)
        data.altitude = place[2].toFixed(1)
        this.$emit('data', data)
      }
    },
    sateOption(time, sate_name){
      var tle = this.sate_TLE[sate_name]
      var place = this.getOrbitPoint(tle, time)
      var tail_track = this.getTailTrack(tle, time)
      var circle = this.getCircleArea(place, this.settings.cover_angle);
      var ret = {
        "sate_pos":place,
        "tail_track":tail_track,
        "circle":circle,
      }
      return ret
    },
    renewData() {
      var time = new Date(Date.now())
      var sate_pos = [], tail_track = []
      var circle;
      for(var sate_name in this.sate_TLE)
      {
        var ret = this.sateOption(time, sate_name)
        var sate_place = ret["sate_pos"]
        if(sate_place[2] <= this.base_height){
          this.base_height = sate_place[2] - 500
          this.renewBaseHeight()
        }
        if(this.chosen_sate == sate_name){
          circle = ret["circle"]
          this.chosen_index = sate_pos.length
          this.chosen_coord = [sate_place[0], sate_place[1]]
        }
        sate_place.push(sate_name)
        sate_pos.push(sate_place)
        tail_track = tail_track.concat(ret["tail_track"])
      }
      
      var all_orbit_data = []
      for(const key in this.orbit_data){
        if(this.orbit_data[key]["show"]){
          all_orbit_data.push(this.orbit_data[key]["orbit"][0])
        }
      }

      var show_series = [
          ///////////////////////////地面站///////////////////////
          {
            type: 'scatter3D',
            coordinateSystem: 'globe',
            symbolSize: 10,
            itemStyle: {
              color: params => {
                  return params.dataIndex === this.chosen_station ? 'rgb(178, 34, 34)':'rgb(61,145,64)' // set color based on data index
                },
              opacity: 1
            },
            data: this.station_loc
          },
          ///////////////////////////没有被选中的卫星///////////////////////
        {
          type: 'lines3D',
          coordinateSystem: 'globe',
          polyline: true,
          effect: {
            show: true,
            trailWidth: 2,
            trailLength: 1,
            trailOpacity: 1,
            trailColor: '#00ff00',
            period: 1, // 速度
          },
          lineStyle: {
            // 航线的视图效果
            color: '#9ae5fc',
            width: 0,
            opacity: 0.6
          },
          data: (this.settings.tail)?tail_track:[],
        },// tail track
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          symbolSize: 0,
          data: [[0,0,this.base_height]]
        }, // base
        {
          type: 'scatter3D',
          name: "satellite", 
          coordinateSystem: 'globe',
          symbol: 'path://M 0 0 M 400 400 M 150 100 L 250 100 L 250 300 L 150 300 z',
          symbolSize: 30,
          itemStyle: {
            color: params => {
                return params.dataIndex === this.chosen_index ? 'rgb(253, 245, 230)' : 'rgb(248,248,255)' // set color based on data index
              },
            borderWidth: 0.1,
            opacity: 1,
          },
          data: sate_pos
        },
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          symbol: 'path://M 0 0 M 400 400 M 0 150 L 100 150 L 150 200 L 100 250 L 0 250 M 400 150 L 300 150 L 250 200 L 300 250 L 400 250 z',
          symbolSize: 40,
          itemStyle: {
            color: params => {
                return params.dataIndex === this.chosen_index ? 'rgb(255, 99, 71)' : 'rgb(30, 144, 255)' // set color based on data index
              },
            borderWidth: 0.1,
            opacity: 1
          },
          data: sate_pos
        }, // 卫星图案

        ///////////////////////////被选中的卫星///////////////////////
        {
          type: 'lines3D',
          coordinateSystem: 'globe',
          polyline: true,
          lineStyle: {
            // 航线的视图效果
            color: '#9ae5fc',
            width: 2,
            opacity: 0.6
          },
          data: (this.chosen_sate != "")?all_orbit_data:[],
        },// orbit
        {
          type: 'lines3D',
          coordinateSystem: 'globe',
          polyline: true,
          lineStyle: {
            color: '#F56C6C',
            width: 2,
            opacity: 0.8
          },
          data: (this.settings.show_coverage)?circle:[],
        }, // 覆盖范围的圈圈
        
      ]
      
      console.log(show_series)
      
      this.myChart.setOption({
        series: show_series
      });
    }
  }
}
</script>


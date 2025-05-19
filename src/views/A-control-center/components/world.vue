<template>
  <div ref="refChart" />
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
                "北邮二号":{"show":false, "orbit":[]},
                "北邮三号":{"show":false, "orbit":[]},
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
                },
      user_loc:[],
      sate_TLE:{
        "天仪33卫星": [
          "1 27844U 03031E   25132.99528033  .00000356  00000+0  17428-3 0  9992",
          "2 27844  98.6766 141.6244 0008357 267.3654  92.6568 14.23974709134748"
        ],
        "丽泽一号": [
          "1 27848U 03031J   25132.57934201  .00000312  00000+0  15710-3 0  9992",
          "2 27848  98.6793 141.2406 0008290 288.4610  71.5667 14.23312040134380"
        ],
        "宝酝号": [
          "1 28895U 05043F   25132.35666827  .00001959  00000+0  32773-3 0  9998",
          "2 28895  98.2457 276.3623 0015207  41.1229 319.1120 14.70921597 42796"
        ],
        "创星雷神号": [
          "1 32785U 08021C   25132.86724478  .00006348  00000+0  46167-3 0  9992",
          "2 32785  97.7832 103.8338 0008675 312.7788  47.2707 15.04151705924912"
        ],
        "元光号": [
          "1 32788U 08021F   25132.88231804  .00919871  39972-3  19863-2 0  9993",
          "2 32788  97.5876 131.4358 0009092 159.3385 200.8261 15.98424668929137"
        ],
        "北邮一号": [
          "1 32790U 08021H   25132.91536980  .00004538  00000+0  35503-3 0  9994",
          "2 32790  97.8218 102.4506 0011959 306.3819  53.6301 15.01515554924747"
        ],
        "北邮二号": [
          "1 40021U 14033M   25132.56203443  .00021498  00000+0  80241-3 0  9999",
          "2 40021  98.0958 144.4908 0010649  65.0635 295.1707 15.27374750594047"
        ],
        "北邮三号": [
          "1 40024U 14033Q   25132.92030996  .00012709  00000+0  63374-3 0  9996",
          "2 40024  98.0905 128.9404 0006786 118.8767 241.3147 15.17671422593539"
        ],
        "天算9号": [
          "1 32791U 08021J   25132.82736330  .00013195  00000+0  65099-3 0  9998",
          "2 32791  97.7263 112.2670 0001530 255.0824 105.0240 15.18040218926281"
        ],
        "天算10号": [
          "1 35932U 09051B   25132.96766254  .00001222  00000+0  25769-3 0  9993",
          "2 35932  98.4333  28.6828 0007627  27.2379 332.9220 14.61268347830688"
        ],
        "天算11号": [
          "1 35933U 09051C   25133.20506171  .00001052  00000+0  22591-3 0  9993",
          "2 35933  98.4263  29.3274 0006299  40.3963 319.7703 14.60693465830853"
        ],
        "天算12号": [
          "1 35935U 09051E   25133.19947550  .00000974  00000+0  21536-3 0  9993",
          "2 35935  98.4359  28.8849 0008636  45.2588 314.9312 14.59495014830409"
        ],
        "天算13号": [
          "1 36799U 10035E   25132.74389849  .00011602  00000+0  60775-3 0  9995",
          "2 36799  98.0612  45.0793 0003484 155.7711 204.3684 15.15975630806751"
        ],
        "天算14号": [
          "1 38767U 12048K   25132.86374331  .00021095  00000+0  58116-3 0  9994",
          "2 38767  64.6481 317.6949 0100573 281.9917  76.9955 15.32155795310574"
        ],
        "天算15号": [
          "1 39090U 13009E   25132.75013003  .00000354  00000+0  13434-3 0  9995",
          "2 39090  98.3827 318.1776 0008521 356.4868   3.6258 14.36797238639551"
        ],
        "天算16号": [
          "1 39091U 13009F   25132.46724640  .00000222  00000+0  90526-4 0  9992",
          "2 39091  98.3884 317.1596 0010233   3.8923 356.2341 14.36295901639529"
        ],
        "天算17号": [
          "1 39151U 13018B   25132.86306395  .00002591  00000+0  26981-3 0  9990",
          "2 39151  98.0695 261.1016 0014154  45.8449 314.3929 14.90671443651006"
        ],
        "天算18号": [
          "1 39268U 13055D   25132.93757621  .00064347 -36541-7  60193-3 0  9998",
          "2 39268  80.9696 120.9268 0255436  79.2387 283.7494 15.35578168610381"
        ],
        "天算19号": [
          "1 39269U 13055E   25132.71079568  .00018174  00000+0  35667-3 0  9999",
          "2 39269  80.9958 236.7919 0480051  24.6305 337.7017 14.75057963603863"
        ],
        "天算20号": [
          "1 39270U 13055F   25132.70605615  .00012857  00000+0  32868-3 0  9990",
          "2 39270  81.0030 300.4561 0586912 201.8967 155.6188 14.47122413580453"
        ],
        "天算21号": [
          "1 39417U 13066B   25132.83787124  .00005119  00000+0  44772-3 0  9995",
          "2 39417  97.7794  90.0082 0045582 142.4042 218.0381 14.96385170620767"
        ],
        "天算22号": [
          "1 39423U 13066H   25132.91940961  .00000930  00000+0  17962-3 0  9998",
          "2 39423  97.6763 306.9607 0166679  52.8255 308.8033 14.57062059608428"
        ],
        "天算23号": [
          "1 39427U 13066M   25133.20601337  .00002935  00000+0  37526-3 0  9991",
          "2 39427  97.8387  47.6757 0096477  95.1736 266.0494 14.78880504615108"
        ],
        "天算24号": [
          "1 39430U 13066Q   25133.14539458  .00001678  00000+0  26824-3 0  9994",
          "2 39430  97.6866 353.4909 0131206 280.4464  78.1979 14.67539188611389"
        ],
        "天算25号": [
          "1 39440U 13066AA  25132.80499903  .00004066  00000+0  41606-3 0  9996",
          "2 39440  97.8487  77.5644 0060414 271.9859  87.4440 14.89749294617305"
        ],
        "天算26号": [
          "1 39441U 13066AB  25133.08079889  .00002433  00000+0  28559-3 0  9993",
          "2 39441  97.8549  71.8507 0067668 300.9985  58.4594 14.84249300617969"
        ],
        "天算27号": [
          "1 39444U 13066AE  25132.83563572  .00007656  00000+0  57853-3 0  9996",
          "2 39444  97.7814  94.6516 0042926 119.3146 241.2377 15.01915106619428"
        ],
        "天算28号": [
          "1 39446U 13066AG  25132.85311145  .00003341  00000+0  32116-3 0  9999",
          "2 39446  97.8224  83.9395 0052492 209.5828 150.2420 14.92690670617779"
        ],
        "天算29号": [
          "1 40020U 14033L   25133.10276999  .00001439  00000+0  22782-3 0  9994",
          "2 40020  97.9215 266.0376 0081492 117.2103 243.7439 14.71560637583468"
        ]
      },
      station_loc:[
        [121.39, 37.52, 210, "天算华东站"],
        [116.20, 39.54, 210, "北京大数据分析"],
        [127.53, 50.22, 210, "黑河站"],
        [112.59, 28.12, 210, "长沙站"],
        [109.45, 24.18, 210, "天算华南站"],
        [98.50, 39.71, 210, "酒泉站"],
        [86.17, 41.72, 210, "库尔勒站"],
        [88.31, 43.36, 210, "达坂城站"],
      ],
      chosen_sate: "",
      chosen_index:-1,
      chosen_station:-1,
      chosen_coord:[115, 40],
      rotate:this.settings.autoRotate,
      base_height: 200,
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
        ///////////////////////////地面站（未选中）///////////////////////
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: {
            color: 'transparent',
          },
          data: this.station_loc,
          label: {
            show: true,
            position: "top",
            distance: -15,
            formatter: () => '2',
            textStyle: {
              color: "transparent",
              padding: [6, 10],
              backgroundColor: {
                image: '/station1.jpg'
              }
            },
          },
          emphasis: {
            label: {
              show: true,
              textStyle: {
                backgroundColor: {
                  image: '/station1.jpg',
                },
              },
            },
          },
          zlevel: 10 // 提高渲染层级，确保贴图不被遮挡
        },
        ///////////////////////////地面站（选中）///////////////////////
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: {
            color: 'transparent',
          },
          data: [this.station_loc[this.chosen_station]], // 只放选中点
          label: {
            show: true,
            position: "top",
            distance: -15,
            formatter: () => '2',
            textStyle: {
              color: "transparent",
              padding: [6, 10],
              backgroundColor: {
                image: '/border_station.jpg',
              }
            },
          },
          emphasis: {
            label: {
              show: true,
              textStyle: {
                backgroundColor: {
                  image: '/border_station.jpg',
                },
              },
            },
          },
          zlevel: 11 // 放上层
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
          coordinateSystem: 'globe',
          symbol: 'circle',
          symbolSize: 20,
          itemStyle: {
            color: 'transparent',
          },
          data: sate_pos,
          label: {
            show: true,
            position: "top",
            distance: -40,
            formatter: () => { return '2' },
            textStyle: {
              color: "transparent",
              padding: [15, 25],
              backgroundColor: {
                image: '/satellite1.jpg'
              }
            },
          },
          emphasis: {
            label: {
              show: true,
              textStyle: {
                backgroundColor: {
                  image: '/satellite1.jpg',
                },
              },
            },
          },
          zlevel: 20 // 提高渲染层级，确保贴图不被遮挡
        },
        ///////////////////////////被选中的卫星///////////////////////
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          symbol: 'circle',
          symbolSize: 20,
          itemStyle: {
            color: 'transparent',
          },
          data:  [sate_pos[this.chosen_index]],
          label: {
            show: true,
            position: "top",
            distance: -40,
            formatter: () => { return '2' },
            textStyle: {
              color: "transparent",
              padding: [15, 25],
              backgroundColor: {
                image: '/border_satellite.jpg'
              }
            },
          },
          emphasis: {
            label: {
              show: true,
              textStyle: {
                backgroundColor: {
                  image: '/border_satellite.jpg',
                },
              },
            },
          },
          zlevel: 30 // 提高渲染层级，确保贴图不被遮挡
        },
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

      this.myChart.setOption({
        series: show_series
      });
    }
  }
}
</script>


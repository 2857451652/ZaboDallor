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
      user_loc:[],
      sate_TLE:{"宝酝号":
                  ["1 49812U 21117A   23107.15706704  .00012764  00000+0  33455-3 0  9991",
                  "2 49812  97.3509 188.0129 0006706 335.7835  92.1609 15.38793088 75923"],
                "创星雷神号":
                  ["1 51830U 22019G   23108.33984188  .00023628  00000+0  11562-2 0  9996",
                  "2 51830  97.4745 182.8795 0012911 276.1911  83.7852 15.18120099 62755"],
                "丽泽一号":
                  ["1 49815U 21117D   23107.85248400  .00124741  00000+0  18330-2 0  9998",
                  "2 49815  97.3462 189.9597 0006494 288.7294 137.8871 15.55027574 76112"],
                "元光号":
                  ["1 47296U 20102A   23107.89801991  .00030795  00000+0  10032-2 0  9992",
                  "2 47296  97.4258 208.2360 0007040 107.5044   2.4022 15.31758000128784"],
                "北邮一号":
                  ["1 55261U 23007P   23093.85628476  .00018574  00000+0  65276-3 0  9997",
                  "2 55261  97.3598 167.3962 0009698  41.8613  69.7682 15.29378720 12017"],
                },
      station_loc:[
        [127.53, 50.22, 0, "黑河站"],
        [121.39, 37.52, 0, "天算华东站"],
        [112.59, 28.12, 0, "长沙站"],
        [109.45, 24.18, 0, "天算华南站"],
        [98.50, 39.71, 0, "酒泉站"],
        [86.17, 41.72, 0, "库尔勒站"],
        [88.31, 43.36, 0, "达坂城站"],
      ],
      chosen_sate: "",
      chosen_index:-1,
      chosen_station:-1,
      chosen_coord:[115, 40],
      rotate:this.settings.autoRotate,
      base_height: 320,
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
  mounted() {
    this.init();
  },
  destroyed() {
    clearInterval(this.timer1)
    clearInterval(this.timer2)
    echarts.dispose(this.myChart)
    console.log("cleared")
  },
  methods: {
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
              intensity: 5,
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
    switchOrbit() {
      var start_time = this.settings.time_before
      var end_time = this.settings.time_after
      var tle = this.sate_TLE[this.chosen_sate]
      if(this.settings.show_orbit){
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
        this.sate_orbit = [orbitData]
        this.orbit_show = true
        this.renewData()
      }
      else{
        this.orbit_show = false
        this.renewData()
      }
    },
    chooseSate(sate_id){
      this.chosen_sate = sate_id
      this.renewData()
      this.setSateToCenter()
    },
    unchooseSate(){
      this.chosen_sate = ""
      this.chosen_index = -1
      this.renewData()
    },
    chooseSation(id){
      this.chosen_coord = [this.station_loc[id][0], this.station_loc[id][1]]
      this.chosen_station = id
      this.renewData()
      this.setSateToCenter()
    },
    unchooseSation(){
      this.chosen_station = -1
      this.renewData()
    },
    setSateToCenter(){
      var option = this.myChart.getOption()
      var set_center = {
        globe:{
          viewControl:{
            targetCoord: this.chosen_coord,
          }
        }
      }
      this.myChart.setOption(set_center)
      this.myChart.setOption(option)
      
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
        
        if(this.chosen_sate == sate_name){
          circle = ret["circle"]
          this.chosen_index = sate_pos.length
          this.chosen_coord = [sate_place[0], sate_place[1]]
          console.log(sate_place)
          console.log(circle)
        }
        sate_place.push(sate_name)
        sate_pos.push(sate_place)
        tail_track = tail_track.concat(ret["tail_track"])
      }
      this.myChart.setOption({
        series: [
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
          data: tail_track,
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
            
            opacity: 1
          },
          data: sate_pos
        },
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          symbol: 'path://M 0 0 M 400 400 M 0 150 L 100 150 L 150 200 L 100 250 L 0 250 M 400 150 L 300 150 L 250 200 L 300 250 L 400 250 z',
          symbolSize: 40,
          itemStyle: {
            //color: 'rgb(30, 144, 255)',
            color: params => {
                return params.dataIndex === this.chosen_index ? 'rgb(255, 99, 71)' : 'rgb(30, 144, 255)' // set color based on data index
              },
            opacity: 1
          },
          data: sate_pos
        }, // 卫星图案
        ///////////////////////////地面站///////////////////////
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          symbolSize: 6,
          itemStyle: {
            color: params => {
                return params.dataIndex === this.chosen_station ? 'rgb(178, 34, 34)':'rgb(255,227,132)' // set color based on data index
              },
            opacity: 1
          },
          data: this.station_loc
        },
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
          data: (this.orbit_show)?this.sate_orbit:[],
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
      });
    }
  }
}
</script>


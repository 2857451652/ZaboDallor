<template>
  <div ref="refChart" style="width: 100%; height: 10.985rem" />
</template>

<script>
// 首先引入三个包
import * as echarts from 'echarts'
import 'echarts-gl'
import axios from "axios";
import { len } from 'echarts-gl';
import world from 'echarts/map/js/world.js'
import satellite from 'satellite.js/dist/satellite.js';

console.log(satellite)

export default {
  props:{
    "settings":Object
  },
  data() {
    return {
      // 地球必需图片，可以去echarts官网下载
      baseTexture: require('@/assets/images/baseTexture.jpg'),
      heightTexture: require('@/assets/images/heightTexture.jpg'),
      night: require('@/assets/images/night.jpg'),
      cload: require('@/assets/images/clouds.png'),
      stars: require('@/assets/images/starfield.jpg'),
      tail_track: [],
      sate_orbit: [],
      sate_pos: [],
      myChart: null,
      orbit_show: false,
      user_loc:[],
      
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
    this.timer = setInterval(() => {
      this.renewData()
    }, 5000)
    this.timer2 = setInterval(() => {
      this.updateData()
    }, 1000)
  },
  methods: {
    getUserLoc(){
      // Get the IP location
      axios.get("https://ipinfo.io/json")
          .then((data) => {
            var loc = data.data.loc.split(',')
            var loation = [0,0,0];
            loation[1] = Number(loc[0])
            loation[0] = Number(loc[1])
            loation.push(0)
            this.user_loc = [loation]
          })
    },
    init() {
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
          environment: this.stars,
          top: 'middle',
          left: 'center',
          displacementScale: 0,
          shading: 'color',
          globeRadius: 120,
          globeOuterRadius: 500,
          viewControl: {
            distance: 240,
            autoRotate: true
          },
        }, {
          show: false,
          baseTexture: this.baseTexture,
          heightTexture: this.heightTexture,
          top: 'middle',
          left: 'center',
          displacementScale: 0,
          environment: 'none',
          shading: 'color',
          globeRadius: 140,
          globeOuterRadius: 500,
          viewControl: {
            distance: 240,
            autoRotate: true
          },
        }],
      }

      this.myChart.setOption(option)
      this.getUserLoc()
      this.renewData()
    },
    stopEarth(){
      var option = this.myChart.getOption()
      option.globe[0].viewControl.autoRotate = false
      option.globe[1].viewControl.autoRotate = false
      this.myChart.setOption(option)
    },
    rotateEarth(){
      var option = this.myChart.getOption()
      option.globe[0].viewControl.autoRotate = true
      option.globe[1].viewControl.autoRotate = true
      this.myChart.setOption(option)
    },
    getCoverArea(time, angle) {
      var place = this.getOrbitPoint(time)
      var lon=place[0], lat=place[1], alti=place[2];
      var cot = Math.cos(Math.PI*angle/180)/Math.sin(Math.PI*angle/180)
      var km_to_degree = 1/111
      var radius = alti * cot * km_to_degree
      // generate a circle
      var sample_rate = 32, i=0;
      var circle = [];
      var point_lon, point_lat;
      for(i=0; i<=sample_rate; i++){
        point_lon = lon+Math.cos(2*Math.PI*i/sample_rate)*radius/Math.cos(Math.PI*lat/180)
        point_lat = lat+Math.sin(2*Math.PI*i/sample_rate)*radius
        if(point_lat > 90){
          point_lat = 90 - (point_lat-90)
          point_lon = point_lon + 180
        }
        else if(point_lat < -90){
          point_lat = -90 - (point_lat+90)
          point_lon = point_lon + 180
        }

        if(point_lon > 180){
          point_lon = -180 + (point_lon-180)
        }
        else if(point_lon < -180){
          point_lon = 180 + (point_lon+180)
        }
        circle.push([point_lon, point_lat])
      }
      return [circle]
    },
    getOrbitPoint(time) {
      // Sample TLE
      var tleLine1 = '1 55261U 23007P   23093.85628476  .00018574  00000+0  65276-3 0  9997',
          tleLine2 = '2 55261  97.3598 167.3962 0009698  41.8613  69.7682 15.29378720 12017';
      
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
    getSpeed(time){
        // Sample TLE
      var tleLine1 = '1 55261U 23007P   23093.85628476  .00018574  00000+0  65276-3 0  9997',
          tleLine2 = '2 55261  97.3598 167.3962 0009698  41.8613  69.7682 15.29378720 12017';
      
      // 初始化一条卫星记录
      var satrec = satellite.twoline2satrec(tleLine1, tleLine2);

      //  或者你可以使用JavaScript日期
      var positionAndVelocity = satellite.propagate(satrec, time);

      var positionEci = positionAndVelocity.position;

      // 将GMT中国时、Julindate时转成格林尼治恒星时
      var gmst = satellite.gstime(time);

      // 你可以得到ECF，大地测量，观察角度和多普勒因子。
      var positionGd = satellite.eciToGeodetic(positionEci, gmst);

      return positionGd.velocity;
    },
    getTailTrack() {
      var orbitData = [];
      var i;
      for(i=8*60; i>=0; i-=10)  // 5 seconds gap
      {
        var time = new Date(Date.now()-(i*1000));
        orbitData.push(this.getOrbitPoint(time))
      }
      return [orbitData]
    },
    switchOrbit() {
      var start_time = this.settings.time_before
      var end_time = this.settings.time_after
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
          orbitData.push(this.getOrbitPoint(time))
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
    updateData() {
      var time = new Date()
      var place = this.getOrbitPoint(time)
      
      this.data.time = time.toString()
      this.data.utc_time = time.toUTCString()
      this.data.longitude = place[0].toFixed(4)
      this.data.latitude = place[1].toFixed(4)
      this.data.altitude = place[2].toFixed(1)
      this.data.speed = this.getSpeed(time)
      this.$emit('data', this.data)
    },
    renewData() {
      var time = new Date()
      var place = this.getOrbitPoint(time)
      
      this.data.time = time.toString()
      this.data.utc_time = time.toUTCString()
      this.data.longitude = place[0].toFixed(4)
      this.data.latitude = place[1].toFixed(4)
      this.data.altitude = place[2].toFixed(1)
      this.data.speed = this.getSpeed(time)
      this.$emit('data', this.data)

      place.pop()
      this.sate_pos = [place]
      this.tail_track = this.getTailTrack()
      var circle = this.getCoverArea(time, this.settings.cover_angle);

      this.myChart.setOption({
        series: [{
          type: 'lines3D',
          coordinateSystem: 'globe',
          globeIndex: 1,
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
          data: this.tail_track,
        },// tail track
        {
          type: 'lines3D',
          coordinateSystem: 'globe',
          globeIndex: 1,
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
          type: 'scatter3D',
          coordinateSystem: 'globe',
          globeIndex: 1,
          symbol: 'path://M 0 0 M 400 400 M 150 100 L 250 100 L 250 300 L 150 300 z',
          symbolSize: 30,
          itemStyle: {
            color: 'rgb(248,248,255)',
            opacity: 1
          },
          data: this.sate_pos
        },
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          globeIndex: 1,
          symbol: 'path://M 0 0 M 400 400 M 0 150 L 100 150 L 150 200 L 100 250 L 0 250 M 400 150 L 300 150 L 250 200 L 300 250 L 400 250 z',
          symbolSize: 30,
          itemStyle: {
            color: 'rgb(30, 144, 255)',
            opacity: 1
          },
          data: this.sate_pos
        }, // 卫星图案
        {
          type: 'lines3D',
          coordinateSystem: 'globe',
          globeIndex: 0,
          polyline: true,
          lineStyle: {
            color: '#E6A23C',
            width: 2,
            opacity: 0.6
          },
          data: (this.settings.show_coverage)?circle:[],
        }, // 覆盖范围的圈圈
        {
          type: 'scatter3D',
          coordinateSystem: 'globe',
          globeIndex: 0,
          symbol: 'circle',
          symbolSize: 5,
          itemStyle: {
            color: 'red',
            opacity: 1
          },
          data: this.user_loc
        },
      ]
      });
      
    }
  }
}
</script>


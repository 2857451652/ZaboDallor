<template>
  <div>
    <el-table :data="list" style="width: 100%;">
      <el-table-column label="卫星名称" width="100" prop="name" />
      <el-table-column label="过境时间" min-width="50" align="center" prop="start_end" />
      <el-table-column label="总时长" min-width="30" align="center" prop="total_time" />
      <el-table-column label="过境观测角度" min-width="50">
        <template slot-scope="scope">
          <el-row style="width: 80%;">
            <span>∠15°</span>
            <el-progress :text-inside="true" :stroke-width="15" 
             :percentage="scope.row.time_15" status="exception" style="width:80%;float:right"/>
          </el-row>
          <el-row style="width: 80%;">
            <span>∠30°</span>
            <el-progress :text-inside="true" :stroke-width="15" 
            :percentage="scope.row.time_30" status="warning" style="margin-top: 1px;width:80%;float:right"/>
          </el-row>
          <el-row style="width: 80%;">
            <span>∠50°</span>
            <el-progress :text-inside="true" :stroke-width="15" 
              :percentage="scope.row.time_50" status="success" style="margin-top: 1px;width:80%;float:right"/>
          </el-row>

        </template>
      </el-table-column>
      <el-table-column label="状态" width="100" align="center" prop="status" />
    </el-table>
  </div>
</template>

<script>
import satellite from 'satellite.js/dist/satellite.js';

export default {
  props:{
    "chosen_station": Number,
  },
  data() {
    return {
      num: 8,
      sate_TLE:{
                "天仪33卫星":
                  ["1 58553U 23193A   24240.17502734  .00035237  00000+0  57111-3 0  9992",
                  "2 58553  97.2528 249.5158 0017939  46.0538 314.2191 15.52515500 40486"],
                "丽泽一号":
                  ["1 00902U 64063E   24239.97477212  .00000101  00000+0  13827-3 0  9994",
                  "2 00902  90.2161  60.5425 0017949 347.3769 137.8022 13.52811982767130"],
                "宝酝号":
                  ["1 49812U 21117A   23107.15706704  .00012764  00000+0  33455-3 0  9991",
                  "2 49812  97.3509 188.0129 0006706 335.7835  92.1609 15.38793088 75923"],
                "创星雷神号":
                  ["1 51830U 22019G   23108.33984188  .00023628  00000+0  11562-2 0  9996",
                  "2 51830  97.4745 182.8795 0012911 276.1911  83.7852 15.18120099 62755"],
                "元光号":
                  ["1 47296U 20102A   23107.89801991  .00030795  00000+0  10032-2 0  9992",
                  "2 47296  97.4258 208.2360 0007040 107.5044   2.4022 15.31758000128784"],
                "北邮一号":
                  ["1 55261U 23007P   23093.85628476  .00018574  00000+0  65276-3 0  9997",
                  "2 55261  97.3598 167.3962 0009698  41.8613  69.7682 15.29378720 12017"],
                },
      station_info:[
        {station:"黑河站", lon:127.53, lat:50.22, alt:500, antenna:"Cross Yagi (UHF)", success_rate:0.85, observation:8520},
        {station:"天算华东站", lon:121.39, lat:37.52, alt:47.8, antenna:"Cross Yagi (UHF)", success_rate:0.82, observation:8520},
        {station:"长沙站", lon:112.59, lat:28.12, alt:58, antenna:"Cross Yagi (UHF)", success_rate:0.79, observation:8520},
        {station:"天算华南站", lon:109.45, lat:24.18, alt:150, antenna:"Cross Yagi (UHF)", success_rate:0.76, observation:8520},
        {station:"酒泉站", lon:98.50, lat:39.71, alt:1350, antenna:"Cross Yagi (UHF)", success_rate:0.89, observation:8520},
        {station:"库尔勒站", lon:86.17, lat:41.72, alt:934, antenna:"Cross Yagi (UHF)", success_rate:0.88, observation:8520},
        {station:"达坂城站", lon:88.31, lat:43.36, alt:1128, antenna:"Cross Yagi (UHF)", success_rate:0.86, observation:8520},
      ],
      list: []
    }
  },
  mounted() {
    this.generateList()
  },
  methods: {
    generateList(){
      var count=0;
      var now_time = new Date();
      var off_set = -2
      now_time.setHours(now_time.getHours() + off_set);
      var time_stamp = off_set*60;
      var station_loc = [this.station_info[parseInt(this.chosen_station)].lon,
                         this.station_info[parseInt(this.chosen_station)].lat]
      var passing = {"天仪33卫星":0,"丽泽一号":0,"宝酝号":0,"创星雷神号":0,"元光号":0,"北邮一号":0}
      var data_record = {
        "天仪33卫星":     { start:'', end:'', time_15:0, time_30:0, time_50:0, status: '未过境'},
        "丽泽一号":     { start:'', end:'', time_15:0, time_30:0, time_50:0, status: '未过境'},
        "宝酝号":     { start:'', end:'', time_15:0, time_30:0, time_50:0, status: '未过境'},
        "创星雷神号": { start:'', end:'', time_15:0, time_30:0, time_50:0, status: '未过境'},
        "元光号":     { start:'', end:'', time_15:0, time_30:0, time_50:0, status: '未过境'},
        "北邮一号":   { start:'', end:'', time_15:0, time_30:0, time_50:0, status: '未过境'}}
      this.list = []
      while (count<this.num && time_stamp<24*60) {
        now_time.setSeconds(now_time.getSeconds() + 10);
        console.log(now_time)
        time_stamp += 1
        for(var name in this.sate_TLE){
          var ret = this.getOrbitPoint(this.sate_TLE[name], now_time)
          var sate_loc=[ret[0], ret[1]], height = ret[2]
          var angle = this.calWatchAngle(sate_loc, station_loc, height)
          console.log(angle, name)
          if(angle >= 15){
            if(passing[name] == 1){
              if(angle >=15 & angle <30)
                data_record[name].time_15 += 1
              else if(angle >=30 & angle <50)
                data_record[name].time_30 += 1
              else if(angle >=50 & angle <90)
                data_record[name].time_50 += 1
              else
                console.log("WTF???")
            }
            else{
              passing[name] = 1
              if(time_stamp==0)
                data_record[name].status = "正在过境"
              else if(time_stamp>=0)
                data_record[name].status = "未过境"
              else
                data_record[name].status = "已过境"
              data_record[name].start = new Date(now_time)
              data_record[name].time_15 += 1
            }
          }
          else{
            if(passing[name] == 1){
              passing[name] = 0
              data_record[name].end = new Date(now_time)
              count += 1
              this.list.push(this.processRetData(data_record[name], name))
            }
          }
        }
      }
    },
    processRetData(undo_data, name){
      var total_time = undo_data.time_15 + undo_data.time_30 + undo_data.time_50
      var time_15, time_30, time_50;
      time_15 = (undo_data.time_15*100/total_time).toFixed(2)
      time_30 = (undo_data.time_30*100/total_time).toFixed(2)
      time_50 = (undo_data.time_50*100/total_time).toFixed(2)

      var ret_data = { name:name, start_end:"", total_time:"", 
          time_15:time_15, time_30:time_30, 
          time_50:time_50, status:undo_data.status }
      ret_data.start_end = undo_data.start.toLocaleString() + ' — '+ undo_data.end.toLocaleString()
      var date = new Date(undo_data.end - undo_data.start)
      var hours = date.getHours().toString().padStart(2, '0');
      var minutes = date.getMinutes().toString().padStart(2, '0');
      var seconds = date.getSeconds().toString().padStart(2, '0');
      ret_data.total_time = `${minutes}min${seconds}s`
      return ret_data
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
  }
}
</script>

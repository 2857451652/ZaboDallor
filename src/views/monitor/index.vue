<template>
  <div class="video-container">
    <el-card style="font-size: 20px; color:#303133;">
      <!-- <el-row style="display:flex;justify-content:center; height:50px; font-size: 35px; ">
        地面站监控
      </el-row> -->
        <el-row style="height:100%;">
          <el-col style="margin-left:10px;width:25%; min-width:320px;">
            <el-row style="margin-bottom:20px;font-weight: bold;">
              <el-card shadow="always">
              <i class="el-icon-place"/>-地面站名称：
              <el-dropdown @command="switchStation" trigger="click" style="">
                <span class="el-dropdown-link">
                  <h2 style="color:#409EFF;font-weight: bold;">
                    {{station_info[chosen_station].station}}
                    <i class="el-icon-arrow-down el-icon--right"/>
                  </h2>
                </span>
                <el-dropdown-menu slot="dropdown" style="width: 150px;">
                  <el-dropdown-item command=0>{{station_info[0].station}}</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> 
              </el-card>
              
            </el-row>
            <el-row style="margin-bottom:20px;">
              <el-card shadow="always">
              <i class="el-icon-location"/> 
              <span style="font-weight: bold;">经度: </span>
              <span style="margin-right:20px">{{station_info[chosen_station].lon}}</span>
              <span style="font-weight: bold;">纬度: </span>
              <span style="margin-right:20px">{{station_info[chosen_station].lat}}</span>
              </el-card>
            </el-row>
            <el-row style="margin-bottom:20px;text-align: center;">
              <el-col>
                <i class="el-icon-key"/> 权限秘钥 
                <el-input v-model="key_id" placeholder="输入六位秘钥" style="width: 150px;"></el-input>
                <el-button type="info" icon="el-icon-unlock" @click="alert"></el-button>
              </el-col>
            </el-row>
            <el-row style="margin-bottom:20px;">
              <el-card shadow="always">
                <el-row style="margin-bottom:20px;text-align: center; font-weight: bold;">
                  <i class="el-icon-warning"/> 摄像头操作 
                </el-row>
                <el-row style="text-align: center;">
                  <el-row style="text-align: center;margin-bottom:15px;">
                    <el-button type="info" icon="el-icon-caret-top" style="font-size: 25px;" disabled></el-button>
                  </el-row>
                  <el-row style="text-align: center;margin-bottom:15px;">
                    <el-button type="info" icon="el-icon-caret-left" style="font-size: 25px;" disabled></el-button>
                    <el-button type="info" icon="el-icon-video-camera" style="font-size: 25px;" disabled></el-button>
                    <el-button type="info" icon="el-icon-caret-right" style="font-size: 25px;" disabled></el-button>
                  </el-row>
                  <el-row style="text-align: center;">
                    <el-button type="info" icon="el-icon-caret-bottom" style="font-size: 25px;" disabled></el-button>
                  </el-row>
                </el-row>
              </el-card>
            </el-row>
          </el-col>
          <el-col class="video-window" id="videoWindow">
            <el-card shadow="always" style="background-color:darkgray; display: grid;place-items: center;">
              <div id="video-container"></div>
              <!-- <img src="/images/yantai_station.jpg" style="width: 100%;"/>
              <span style="position: absolute;bottom: 6%;right: 4%;font-weight: bold;">
                <i class="el-icon-video-camera" style="color:red"/>
                <span style="color:red;" :style="{ opacity: opacityValue }">◉ </span>
                {{ currentTime }}</span> -->
            </el-card>
          </el-col>
        </el-row>
    </el-card>
    
    <el-button type="primary" plain icon="el-icon-back"
      style="width: 150px; height: 40px; position:absolute; right:15px; bottom:25px; font-weight: bold;"
      @click="backToMain">返回天算星座</el-button>
  </div>

</template>

<script>
// import EZUIKit from 'ezuikit-js';
const EZUIKit = window.EZUIKit
export default {
  name: 'monitor',
  components: {
  },
  data() {
    return {
      station_info:[
        {station:"烟台站", lon:121.46, lat:37.48},
      ],
      chosen_station: 0,
      currentTime: '',
      opacityValue:1,
      timer_1: null,
      timer_2:null,
      key_id:null,
      accessToken:null,
    }
  },
  mounted() {
    this.getAccessToken()
    // this.timer_1 = setInterval(() => {
    //   this.currentTime = this.getCurrentTime();
    // }, 1000);

    // this.timer_2 = setInterval(() => {
    //   if(this.opacityValue==1)
    //     this.opacityValue=0
    //   else
    //     this.opacityValue=1
    // }, 400);
    
  },
  methods: {
    backToMain(){
      this.$router.push({ name: 'sat_orbit' })
    },
    alert(){
      this.$message.error("请输入正确秘钥，以解锁摄像头操作");
    },
    getAccessToken(){
      const axios = require('axios');
      const qs = require('qs');
      var data = qs.stringify({
        appKey: '1ae1753d81634e99bb0555424b665e17',
        appSecret: 'c7f79c73008fe1e42d5ef345e5d36d62' 
      });
      var config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://open.ys7.com/api/lapp/token/get',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data : data
      };

      axios.request(config)
      .then((response) => {
        this.accessToken = response.data.data.accessToken;
        this.createVideo()
      })
      .catch((error) => {
        console.log(error);
      });
    },
    createVideo(){
      const myDiv = document.getElementById('videoWindow');
      const width = myDiv.offsetWidth;

      var player = new EZUIKit.EZUIKitPlayer({
        id: 'video-container', // 视频容器ID
        accessToken: this.accessToken,
        url: 'ezopen://open.ys7.com/BA3307138/1.live',
        width: width - 50,
        height: parseInt((width - 50)*5/8),
        audio: false,
        handleError: (err) => {
          if (err.type === "handleRunTimeInfoError" && err.data.nErrorCode === 5) {
            // 加密设备密码错误
          }
        },
      })
    },
    switchStation(){

    },
    getCurrentTime() {
      const date = new Date();
      // 使用 Date 对象的方法获取当前日期和时间的年、月、日、小时、分钟、秒，并拼接成日期时间字符串
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();
      return `${year}-${this.formatNumber(month)}-${this.formatNumber(day)} ${this.formatNumber(hours)}:${this.formatNumber(minutes)}:${this.formatNumber(seconds)}`;
    },
    formatNumber(num) {
      // 辅助方法，将数字格式化为两位数
      return num < 10 ? `0${num}` : num;
    }
  }
}
</script>

<style lang="scss" scoped>
.video-container {
  padding: 32px;
  background-color: rgb(24, 39, 64);
  position: absolute;
  height: 100%; /* 设置高度为视口高度的100% */
  width: 100%;
  overflow-y: auto; /* 如果内容超过屏幕高度，显示滚动条 */
}
.video-window{
  margin-left:20px;
  width:70%;
  height:80%; 
  min-width:320px;
  text-align: center;
}
</style>

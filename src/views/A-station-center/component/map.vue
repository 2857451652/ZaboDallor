<template>
    <div style="width: 600px;height: 400px;">
        <div id="my_map" style="width: 100%;height: 100%;"></div>
        <div style="position: absolute; bottom:5%; right:1%">
            <el-button icon="el-icon-location-outline" circle @click="zoomBack"></el-button>
        </div>
    </div>
</template>
<script>
import * as echarts from 'echarts'
import 'echarts/extension/bmap/bmap'
export default {
    filters: {
    },
    props:{
        "chosen_loc":Array
    },
    data() {
      return {
        myChart: null,
        loc:[120.13066322374, 30.240018034923]
      }
    },
    mounted() {
        this.LoadBaiduMapScript()
        this.init()
    },
    destroyed() {
        if(this.myChart)
            echarts.dispose(this.myChart)
    },
    methods: {
        LoadBaiduMapScript() {
            //console.log("初始化百度地图脚本...");
            const AK = "LEHuGEVbSCq0toxFWf2lyoiIIHuleXzL";
            const BMap_URL = "https://api.map.baidu.com/api?v=2.0&ak="+ AK +"&s=1&callback=onBMapCallback";
            const this_1 = this
            return new Promise((resolve, reject) => {
                // 如果已加载直接返回
                if(typeof BMap !== "undefined") {
                    resolve(BMap);
                    return true;
                }
                // 百度地图异步加载回调处理
                window.onBMapCallback = function () {
                    resolve(BMap);
                    console.log("百度地图脚本初始化成功...");
                    this_1.init()
                };
                // 插入script脚本
                let scriptNode = document.createElement("script");
                scriptNode.setAttribute("type", "text/javascript");
                scriptNode.setAttribute("src", BMap_URL);
                document.body.appendChild(scriptNode);
            });
        },
        init(){
            var dom = document.getElementById('my_map')
            this.myChart = echarts.init(dom);
            this.setStation()
        },
        setStation(){
            var option = {
                bmap:{
                    center: this.chosen_loc,
                    zoom: 6,
                    roam: true,
                },
                series: [
                    {
                        type: 'effectScatter',
                        coordinateSystem: 'bmap',
                        data: [this.chosen_loc],
                    }
                ]
            };
            this.myChart.setOption(option)
        },
        zoomBack(){
            console.log("back!")
            var options = this.myChart.getOption()
            options.bmap[0].center = this.chosen_loc
            options.bmap[0].zoom = 6
            this.myChart.setOption(options)
        }
    }
  }
  </script>
  
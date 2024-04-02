<template>
  <div class="dashboard-editor-container">
    <el-card>
      <el-row style="text-align:center; margin-bottom:20px">
        <span style="font-size:40px;">
          <i class="el-icon-odometer" style="margin-right:10px" />卫星温度数据分析
        </span>
      </el-row>
      <el-row>
        <el-card shadow="hover">
          <el-tooltip class="item" effect="dark" content="温度变化概览" placement="top">
            <img src="@/assets/images/figure1.png" class="scaled-image"/>
          </el-tooltip>
        </el-card>
      </el-row>
      <el-row >
        <el-card shadow="hover">
          <el-tooltip class="item" effect="dark" content="温度对载荷CPU频率的影响" placement="top">
            <img src="@/assets/images/figure2.png" class="scaled-image"/>
          </el-tooltip>
        </el-card>
      </el-row>
      <el-row >
        <el-card shadow="hover">
          <el-tooltip class="item" effect="dark" content="载荷表面温度过热状况" placement="top">
            <img src="@/assets/images/figure3.png" class="scaled-image"/>
          </el-tooltip>
        </el-card>
      </el-row>
    </el-card>

    <el-card style="margin-top: 20px">
      <el-row style="text-align:center; margin-bottom:20px">
        <span style="font-size:40px;">
          <i class="el-icon-odometer" style="margin-right:10px" />卫星能耗数据分析
        </span>
      </el-row>
      <el-row>
        <el-card shadow="hover">
          <el-tooltip class="item" effect="dark" content="功率变化概览" placement="top">
            <img src="@/assets/images/figure4.png" class="scaled-image"/>
          </el-tooltip>
        </el-card>
      </el-row>
      <el-row>
        <el-card shadow="hover">
          <el-tooltip class="item" effect="dark" content="卫星能耗分析" placement="top">
            <img src="@/assets/images/figure5.jpg" class="scaled-image"/>
          </el-tooltip>
        </el-card>
      </el-row>
    </el-card>
  </div>
</template>


<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(24, 39, 64); 
  position: relative;  
  height: calc(100vh - 84px); /* 设置高度为视口高度的100% */
  overflow-y: auto; /* 如果内容超过屏幕高度，显示滚动条 */

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }
  .scaled-image {
    width: 100%; /* 设置图片宽度为原始宽度的50%，你可以根据需要调整 */
    height: auto; /* 保持纵横比 */
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

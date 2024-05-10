<template>
  <div class="container">
    <iframe src="https://service.emposat.com/ttc/orbit-view/#/" width="100%" height="100%" scrolling="auto" seamless></iframe>
  
    <el-button type="primary" icon="el-icon-back"
      style="width: 150px; height: 40px; position:absolute; right:15px; bottom:80px; font-weight: bold;"
      @click="backToMain">返回天算星座</el-button>
  </div>
  </template>

<script>
export default {
  name: 'monitor',
  components: {
  },
  data() {
    return {
    }
  },
  methods: {
    backToMain(){
      this.$router.push({ name: 'sat_orbit' })
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
  width: 100%;
}
</style>
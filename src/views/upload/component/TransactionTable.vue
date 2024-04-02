<template>
  <el-table :data="tableList" style="width: 100%;padding-top: 15px;">
    <el-table-column label="用户ID/User ID" width="150" prop="uid" />
    <el-table-column label="文件名称/File Name" min-width="50" align="center" prop="doc" />
    <el-table-column label="上传时间/Upload Time" min-width="50" align="center" prop="cad" />
    <el-table-column label="状态/State" width="100" align="center" prop="s" />
  </el-table>
</template>

<script>
import moment from 'moment'
export default {
  filters: {
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  props:{
    tableList:{
        type: Array,
        default: []
      }
  },
  data() {
    return {
      projItem: {
        type: Object,
        default: () => {
          return {
            ID: 0,
            DocDes: '',
            DocCode: '',
            TimeDocDes: '',
            TimeDocCode: '',
            DeletedAt: '',
          }
        }
      },
    }
  },
  created() {
    // this.fetchData()
  },
  mounted() {
    // this.makeList()
  },
  methods: {
    makeList(){
      console.log(this.projItem)
      if(this.projItem.DocDes != ""){
        this.tableList.push({ uid: this.projItem.ID, doc: this.projItem.DocDes, 
          cad: this.projItem.TimeDocDes, s: 'complete' })
      }
      if(this.projItem.DocCode != ""){
        this.tableList.push({ uid: this.projItem.ID, doc: this.projItem.DocCode, 
          cad: this.projItem.TimeDocCode, s: 'complete' })
      }
    }
  }
}
</script>

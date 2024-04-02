<template>
  <div class="upload-container">
    <el-card>
      <el-row style="margin-bottom:20px">
        <el-col>
          <el-steps :space="300" :active="active" finish-status="success">
            <el-step title="步骤 1/Step 1" description="申请应用部署/Apply for deployment" />
            <el-step
              title="步骤 2/Step 2"
              icon="el-icon-edit"
              description="上传描述文档/Upload description (.pdf)"
            />
            <el-step
              title="步骤 3/Step 3"
              icon="el-icon-upload"
              description="上传数据文件与代码文件/Upload codes (.zip)"
            />
          </el-steps>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px">
        <el-upload
          class="upload-demo"
          drag
          :limit="1"
          :on-change="setUploadState2"
          accept=".pdf"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          v-if="active==1"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">Drag File Here, or <em>Click Here</em> to Upload</div>
          <div slot="tip" class="el-upload__tip">不大于/No larger than: 500kb</div>
        </el-upload>

        <el-upload
          class="upload-demo"
          drag
          :limit="1"
          :on-change="setUploadState3"
          accept=".zip"
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
          v-if="active==2"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">Drag File Here, or <em>Click Here</em> to Upload</div>
          <div slot="tip" class="el-upload__tip">不大于/No larger than: 500kb</div>
        </el-upload>


        <el-empty v-if="active==3" description="All Done! Congratulations~"></el-empty>
      </el-row>
      <el-row>
        <transaction-table :tableList="tableList"/>
      </el-row>
    </el-card>

  </div>

</template>

<script>
import TransactionTable from './component/TransactionTable'
import {getUserInfo,getProjectInfo,uploadFunc} from '../../api/requests'
export default {
  name: 'DashboardAdmin',
  components: {
    TransactionTable
  },
  data() {
    return {
      active:1,
      language: ["English", "中文"][0],
      tableList: [],
      projItem: null
    }
  },
  mounted() {
    this.getProjInfo();
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
      console.log(this.tableList)
    },
    //文件上传
    setUploadState2(file) {
        console.log("setUploadState2")
        this.uploadFile = file;
        this.uploadUrl = URL.createObjectURL(this.uploadFile.raw);
        // this.$refs.upexcel.clearFiles();
        this.submitDes();
    },
    setUploadState3(file) {
        console.log("setUploadState3")
        this.uploadFile = file;
        this.uploadUrl = URL.createObjectURL(this.uploadFile.raw);
        // this.$refs.upexcelS3.clearFiles();
        this.submitCode();
    },
    submitDes() {
        console.log("submitUpload")
        let formData = new FormData();
        // formData.append("examId", this.rowdata.examId);
        formData.append("file", this.uploadFile.raw);
        uploadFunc("/uploadFile", formData, (ret) => {
            console.log("导入2222")
            console.log(ret.data)
            if(ret.data.code == 0){
                this.$message.success('导入成功');
                // this.step2.showUpload = false;
                this.$refs.upexcel.clearFiles();
            }
            console.log("getProjectInfo")
            this.getProjInfo();
      });
    },

    submitCode() {
        console.log("submitUpload")
        let formData = new FormData();
        // formData.append("examId", this.rowdata.examId);
        formData.append("file", this.uploadFile.raw);
        uploadFunc("/uploadFileS3", formData, (ret) => {
            console.log("uploadFileS3 end")
            if(ret.data.code == 0){
                this.$message.success('导入成功');
                // this.step3.showUpload = false;
                this.$refs.upexcelS3.clearFiles();
            }

            this.getProjInfo();
      });
    },

    getProjInfo(){ 
      getProjectInfo(null).then(result=>{
          console.log(result.data)
          this.projItem = result.data;
          this.makeList()
          if(this.projItem.DocDes == "" || this.projItem.DocDes == null){
              this.active=1;
          }else if(this.projItem.DocCode == ""){
              this.active=2;
          }else{
              this.active=3;
          }
          //this.calculateInfo();

      })
    },
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  padding: 32px;
  background-color: rgb(24, 39, 64);
  position: relative;
  height: calc(100vh - 84px); /* 设置高度为视口高度的100% */
  overflow-y: auto; /* 如果内容超过屏幕高度，显示滚动条 */
}
</style>

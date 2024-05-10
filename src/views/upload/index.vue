<template>
  <div class="upload-container">
    <el-card style="margin-bottom:20px; font-size: 20px; color:#303133">
      <i class="el-icon-message-solid"></i>INSTRUCTIONS: 
      Please refer to 
      <a href="https://github.com/TiansuanConstellation/TiansuanExperimentPlatform" 
         style="color: #409EFF;" target="_blank">
         <i class="el-icon-guide"></i>Tiansuan Experiment Platform
      </a> 
      for detailed information about the deployment. 
      <!-- And you can download the guiding document by clicking
      <a href="/Guide.pdf" style="color: #409EFF;" target="_blank">
         here<i class="el-icon-s-order"></i>
      </a>.  -->
      Thank you very much for your interest ^^.
    </el-card>
    <el-card>
      <el-row style="margin-bottom:20px">
        <el-col style="width:70%">
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
        <el-col style="width:30%">
          <el-row style="margin-bottom:10px; float: right; margin-right:30px; 
          font-size:18px; color: #606266;" v-if="active!=0">
            <i class="el-icon-info"></i> Apply ID: 
            <span style="">{{chosenItem.ID}} </span>
            Name: 
            <span style="">{{chosenItem.SubProjectName}} </span>
          </el-row>
          <el-row>
          <el-dropdown trigger="click" @command="handleCommand" style="float: right;  margin-right:30px">
            <span class="el-dropdown-link" style="font-size: 16px;color: #409EFF;">
              申请列表/Apply List<i class="el-icon-s-unfold"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item 
              v-for="item in projItem" 
              icon="el-icon-paperclip"
              :command="item.ID"
              >
                {{ item.SubProjectName }}
              </el-dropdown-item>

              <el-dropdown-item icon="el-icon-plus" command="NEW" divided>新申请/New Apply</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-row>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px; min-height: 150px;
      display: flex; align-items: center; justify-content: center;" >
        <el-upload
          class="upload-demo"
          drag
          :limit="2"
          :on-change="setUploadState2"
          accept=".pdf"
          action="none"
          :auto-upload="false"
          style="width: 100%;"
          v-if="active==1"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">Drag File Here, or <em>Click Here</em> to Upload</div>
          <div slot="tip" class="el-upload__tip">不大于/No larger than: 500KB</div>
        </el-upload>

        <el-upload
          class="upload-demo"
          drag
          :limit="2"
          :on-change="setUploadState3"
          accept=".zip"
          action="none"
          :auto-upload="false"
          style="width: 100%;"
          v-if="active==2"
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">Drag File Here, or <em>Click Here</em> to Upload</div>
          <!-- <div slot="tip" class="el-upload__tip">不大于/No larger than: 500kb</div> -->
        </el-upload>
        
        <span v-if="active==0" style="font-size: 20px; color:#F56C6C">
          <i class="el-icon-info"></i>Please Enter a Name for Your Application:
          <el-input placeholder="Application Name" v-model="project_name" clearable style="width: 300px;"></el-input>
          <el-button type="warning" style="margin-left:20px" @click="applyNew">Click to Continue</el-button>
        </span>
        
        <el-image v-if="active==3" src="/images/done.png"></el-image>

      </el-row>
      <el-row style="margin-bottom:20px;">
        <transaction-table :tableList="tableList"/>
      </el-row>
      <el-row style="margin-bottom:20px; float:right; margin-right:20px;">
        <el-button type="warning" style="width:150px" icon="el-icon-refresh-left" 
        @click="restartAlert"
        round :disabled="active<=1">重启/Restart</el-button>
        <el-button type="danger" style="width:150px" icon="el-icon-delete" 
        @click="deleteAlert"
        round>删除/Delete</el-button>
      </el-row>
    </el-card>

  </div>

</template>

<script>
import TransactionTable from './component/TransactionTable'
import {getUserInfo,getProjectInfo,uploadFunc, newapply, delapply, resetapply} from '../../api/requests'
export default {
  name: 'DashboardAdmin',
  components: {
    TransactionTable
  },
  data() {
    return {
      active:0,
      language: ["English", "中文"][0],
      tableList: [],
      uploading: false,
      project_name: "",
      projItem: [],
      chosenItem: null,
      chosenID: 0,
    }
  },
  mounted() {
    this.getProjInfo();
    // this.makeList()
  },
  methods: {
    handleCommand(apply_id){
      if(apply_id!="NEW"){
        console.log(apply_id)
        var id = 0
        for(id=0; id<this.projItem.length; id++){
          if(this.projItem[id].ID == apply_id)
            break;
        }
        this.chosenID = id
        this.renewPage()
      }
      else{
        this.active = 0
        this.chosenID = this.projItem.length
      }
    },
    restartAlert(){
      this.$confirm('This process will RESTART the file transformation, sure to continue?', 'Alert!', {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          this.restartApply()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled Process'
          });          
        });
    },
    deleteAlert(){
      this.$confirm('This process will DELETE this application FOREVER, sure to continue?', 'Warning!', {
          confirmButtonText: 'confirm',
          cancelButtonText: 'cancel',
          type: 'warning'
        }).then(() => {
          this.deleteApply()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Canceled Process'
          });          
        });
    },
    restartApply(){
      var qs = require('qs');
      var params = qs.stringify({
        subId: this.chosenItem.ID,
      });
      resetapply(params).then(result => {
        if(result.code==0){
          this.getProjInfo();
          this.chosenID = 0
          this.$message.success('Successfully Restarted!');
        }
        else{
          this.$message.error(result.message);
        }
      }).catch(function(error){
        this.$message.error("Bad request");
      });
    },
    deleteApply(){
      var qs = require('qs');
      var params = qs.stringify({
        subId: this.chosenItem.ID,
      });
      delapply(params).then(result => {
        if(result.code==0){
          this.getProjInfo();
          this.chosenID = 0
          this.$message.success('Successfully Deleted!');
        }
        else{
          this.$message.error(result.message);
        }
      }).catch(function(error){
        this.$message.error("Bad request");
      });
    },
    applyNew(){
      var qs = require('qs');
      var params = qs.stringify({
        subName: this.project_name,
      });
      newapply(params).then(result => {
        if(result.code==0){
          this.getProjInfo();
          this.$message.success('Successfully Applied!');
        }
        else{
          this.$message.error(result.message);
        }
      }).catch(function(error){
        this.$message.error("Bad request");
      });
    },
    checkPdf(file) {
      const isPDF = file.type === 'application/pdf';
      const isLt500KB = file.size / 1024 < 500;

      if (!isPDF) {
        this.$message.error('Only .pdf file is allowed!');
      }
      if (!isLt500KB) {
        this.$message.error('No larger than 500KB!');
      }
      
      // 返回 false 或者 Promise 对象
      return isLt500KB;
    },
    checkZip(file) {
      const isZIP = file.type === 'application/x-zip-compressed';
      console.log(file.type)
      if (!isZIP) {
        this.$message.error('Only .zip file is allowed!');
      }
      
      // 返回 false 或者 Promise 对象
      return isZIP;
    },
    makeList(){
      console.log(this.chosenItem)
      this.tableList = []
      if(this.chosenItem.DocDes != ""){
        this.tableList.push({ 
          uid: this.chosenItem.NameSubUser, 
          pid: this.chosenItem.SubProjectName, 
          doc: this.chosenItem.OriDocDes,
          cad: this.chosenItem.TimeDocDes, s: 'complete' })
      }
      if(this.chosenItem.DocCode != ""){
        this.tableList.push({ 
          uid: this.chosenItem.NameSubUser, 
          pid: this.chosenItem.SubProjectName, 
          doc: this.chosenItem.OriDocCode,
          cad: this.chosenItem.TimeDocCode, s: 'complete' })
      }
      console.log(this.tableList)
    },
    //文件上传
    setUploadState2(file) {
        // this.$refs.upload.clearFiles();
        console.log("setUploadState2")
        this.uploadFile = file;
        this.uploadUrl = URL.createObjectURL(this.uploadFile.raw);
        this.submitDes();
    },
    setUploadState3(file) {
        console.log("setUploadState3")
        this.uploadFile = file;
        this.uploadUrl = URL.createObjectURL(this.uploadFile.raw);
        this.submitCode();
    },
    submitDes() {
      console.log("submitUpload")
      let formData = new FormData();
      // formData.append("examId", this.rowdata.examId);
      formData.append("file", this.uploadFile.raw);
      formData.append('subId', this.chosenItem.ID);
      uploadFunc("/uploadFile", formData, (ret) => {
        if(ret.code == 0){
            this.$message.success('Successfully Uploaded');
            
          console.log(this.$refs)
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
        formData.append('subId', this.chosenItem.ID);
        uploadFunc("/uploadFileS3", formData, (ret) => {
          if(ret.code == 0){
              this.$message.success('Successfully Uploaded');
          }
          else{
            this.$message.error(ret.message);
          }

          this.getProjInfo();
      });
    },

    getProjInfo(){ 
      getProjectInfo(null).then(result=>{
          console.log(result)
          this.projItem = result.data;
          this.renewPage();
      })
    },
    renewPage(){
      if(this.projItem.length==0){
        this.active=0;
        this.chosenItem =  {
            "ID": 0,
            "CreatedAt": "",
            "UpdatedAt": "",
            "DeletedAt": null,
            "SubProjectName": "",
            "DocDes": "",
            "OriDocDes": "",
            "TimeDocDes": "",
            "DocCode": "",
            "OriDocCode": "",
            "TimeDocCode": "",
            "IdSubUser": 0,
            "NameSubUser": "0"
        }
      }
      else{
        this.chosenItem = this.projItem[this.chosenID]
        if(this.chosenItem.DocDes == "" || this.chosenItem.DocDes == null){
            this.active=1;
        }else if(this.chosenItem.DocCode == ""){
            this.active=2;
        }else{
            this.active=3;
        }
        this.makeList()
      }
      
    },
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  padding: 32px;
  background-color: rgb(24, 39, 64);
  position: absolute;
  height: 100%; /* 设置高度为视口高度的100% */
  width: 100%;
  overflow-y: auto; /* 如果内容超过屏幕高度，显示滚动条 */
}
</style>

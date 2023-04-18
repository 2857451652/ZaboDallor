<template>
  <div class="upload-container">
    <el-card>
      <el-row style="margin-bottom:20px">
        <el-col>
          <el-steps :space="200" :active="1" finish-status="success">
            <el-step title="Approved" description="Apply for an account" />
            <el-step
              title="Processing"
              icon="el-icon-edit"
              description="Upload description document(.pdf)"
            />
            <el-step
              title="Step 3"
              icon="el-icon-upload"
              description="Upload code with data(.zip)"
            />
          </el-steps>
        </el-col>
      </el-row>
      <el-row style="margin-bottom:20px">
        <el-upload
          class="upload-demo"
          drag
          action="https://jsonplaceholder.typicode.com/posts/"
          multiple
        >
          <i class="el-icon-upload" />
          <div class="el-upload__text">Drag file here, or <em>click to upload</em></div>
          <div slot="tip" class="el-upload__tip">No bigger than 500kb</div>
        </el-upload>
      </el-row>
      <el-row>
        <transaction-table />
      </el-row>
    </el-card>

  </div>

</template>

<script>
import TransactionTable from './component/TransactionTable'
export default {
  name: 'DashboardAdmin',
  components: {
    TransactionTable
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.upload-container {
  padding: 32px;
  background-color: rgb(24, 39, 64);
  position: relative;
}
</style>

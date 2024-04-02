<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="进程ID" min-width="50" prop="pid" />
    <el-table-column label="用户ID" min-width="50" prop="uid" />
    <el-table-column label="进程CMD" width="200" align="center" prop="cmd" />
    <el-table-column label="运行时间" width="200" align="center" prop="rt" />
    <el-table-column label="操作">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)"
        >查看</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >删除</el-button>
      </template>
    </el-table-column>
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
  data() {
    return {
      list: [{ pid: 321295, uid: 431435, cmd: 'Bash', rt: 
                    moment().subtract(19, 'hours').subtract(15, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss') },
        { pid: 321295, uid: 431435, cmd: 'Bash', rt: 
                    moment().subtract(24, 'hours').subtract(54, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss')},
        { pid: 321295, uid: 431435, cmd: 'Bash', rt: 
                    moment().subtract(25, 'hours').subtract(52, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss') }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
  }
}
</script>

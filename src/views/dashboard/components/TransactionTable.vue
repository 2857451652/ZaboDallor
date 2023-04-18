<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="Process ID" min-width="50" prop="pid" />
    <el-table-column label="User ID" min-width="50" prop="uid" />
    <el-table-column label="Process CMD" width="200" align="center" prop="cmd" />
    <el-table-column label="Runtime" width="200" align="center" prop="rt" />
    <el-table-column label="Operation">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)"
        >Check</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >Delete</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>

export default {
  filters: {
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },
  data() {
    return {
      list: [{ pid: 321295, uid: 431435, cmd: 'Bash', rt: '2022/5/4  1:45:01' },
        { pid: 321295, uid: 431435, cmd: 'Bash', rt: '2022/5/4  1:45:01' },
        { pid: 321295, uid: 431435, cmd: 'Bash', rt: '2022/5/4  1:45:01' }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
  }
}
</script>

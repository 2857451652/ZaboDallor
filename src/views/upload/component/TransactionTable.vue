<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="User ID" width="100" prop="uid" />
    <el-table-column label="Document" min-width="50" align="center" prop="doc" />
    <el-table-column label="Code & data" min-width="50" align="center" prop="cad" />
    <el-table-column label="Status" width="100" align="center" prop="s" />
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
      list: [
        { uid: 431435, doc: '2022/5/4 1:45:01', cad: '2022/5/4 1:46:05', s: 'complete' },
        { uid: 743294, doc: '2022/5/4 1:45:01', cad: '2022/5/4 1:46:05', s: 'complete' },
        { uid: 581029, doc: '2022/5/4 1:45:01', cad: '2022/5/4 1:46:05', s: 'complete' },
        { uid: 401869, doc: '2022/5/4 1:45:01', cad: '-', s: 'error' }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
  }
}
</script>

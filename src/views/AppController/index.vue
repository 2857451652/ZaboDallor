<template>
  <div class="app-container">
    <el-row style="margin-bottom:10px">
      <span style="font-size:30px; color:#1f1f1f">星载应用管理</span>
      <span style="size:10px; margin-left: 10px; color: #2ac06d">
        <i class="el-icon-success" />
        状态正常</span>
    </el-row>
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="ID" style="width: 400px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.importance" placeholder="state" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="float:right;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新建
      </el-button>

    </div>
    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column
        label="进程ID"
        prop="id"
      />
      <el-table-column
        label="进程状态"
        prop="state"
      />
      <el-table-column
        label="运行阶段"
        prop="phase"
      />
      <el-table-column
        label="创建时间"
        prop="createTime"
      />
      <el-table-column
        label="更新时间"
        prop="updateTime"
      />
      <el-table-column
        label="进程描述"
        prop="description"
      />
      <el-table-column label="Operation" align="center" width="230" class-name="small-padding fixed-width">
        <template>
          <el-button type="primary" size="mini" @click="handleUpdate()">
            修改
          </el-button>
          <el-button size="mini" type="success" @click="handleModifyStatus()">
            更新
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete()">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import moment from 'moment';

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableData: [{
        id: '47678852',
        state: 'running',
        phase: '80%',
        createTime: moment().subtract(19, 'hours').subtract(21, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(19, 'hours').subtract(20, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '星载目标识别应用'
      }, {
        id: '125784443',
        state: 'waiting',
        phase: '0%',
        createTime: moment().subtract(20, 'hours').subtract(13, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(19, 'hours').subtract(15, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '图片过滤应用'
      }, {
        id: '235478453',
        state: 'waiting',
        phase: '0%',
        createTime: moment().subtract(20, 'hours').subtract(15, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(19, 'hours').subtract(45, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '目标检测应用'
      }, {
        id: '235478453',
        state: 'waiting',
        phase: '0%',
        createTime: moment().subtract(24, 'hours').subtract(21, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(20, 'hours').subtract(34, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '目标检测应用'
      }, {
        id: '235478453',
        state: 'waiting',
        phase: '0%',
        createTime: moment().subtract(24, 'hours').subtract(54, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(20, 'hours').subtract(45, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '目标检测应用'
      }, {
        id: '235478453',
        state: 'waiting',
        phase: '0%',
        createTime: moment().subtract(25, 'hours').subtract(15, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(19, 'hours').subtract(24, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '目标检测应用'
      }, {
        id: '235478453',
        state: 'waiting',
        phase: '0%',
        createTime: moment().subtract(25, 'hours').subtract(29, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(23, 'hours').subtract(62, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '目标检测应用'
      }, {
        id: '235478453',
        state: 'waiting',
        phase: '0%',
        createTime: moment().subtract(25, 'hours').subtract(52, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(24, 'hours').subtract(26, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '目标检测应用'
      }, {
        id: '235478453',
        state: 'waiting',
        phase: '0%',
        createTime: moment().subtract(26, 'hours').subtract(43, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(22, 'hours').subtract(42, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '目标检测应用'
      }, {
        id: '235478453',
        state: 'waiting',
        phase: '0%',
        createTime: moment().subtract(26, 'hours').subtract(39, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        updateTime: moment().subtract(24, 'hours').subtract(26, 'minutes').
                    format('YYYY-MM-DD HH:mm:ss'),
        description: '目标检测应用'
      }],

      tableKey: 0,
      table_data: [{
        id: '23856925',
        timestamp: '111',
        author: '@first',
        reviewer: '@first',
        title: '@title(5, 10)',
        content_short: 'mock data',
        content: '111',
        forecast: '@float(0, 100, 2, 2)',
        importance: '@integer(1, 3)',
        'type|1': ['CN', 'US', 'JP', 'EU'],
        'status|1': ['published', 'draft'],
        display_time: '@datetime',
        comment_disabled: true,
        pageviews: '@integer(300, 5000)',
        platforms: ['a-platform']
      }],
      list: [[1, 1, 1, 1]],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: ['running', 'waiting', 'error', 'finished'],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus() {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate() {
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete() {
      this.$notify({
        title: 'Success',
        message: 'Delete Successfully',
        type: 'success',
        duration: 2000
      })
      // this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  height: calc(100vh - 84px); /* 设置高度为视口高度的100% */
  overflow-y: auto; /* 如果内容超过屏幕高度，显示滚动条 */
}
</style>
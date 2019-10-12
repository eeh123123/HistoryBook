<template>
    <div>
        <el-table tooltip-effect="light" :data="tableData" :row-style="{height:'40px'}" :cell-style="{padding:0}" :row-class-name="this.$util.tableRowClassName" @selection-change='selectedTableData'>
            <el-table-column v-for="(item, index) in tableHead" :value="item.code" :key="index" :show-overflow-tooltip="true" :prop="item.code" :label="item.label" align='center'></el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination background @current-change="handleCurrentChange" :current-page.sync="currentPage" :page-size='pageSize'  layout="total, prev, pager, next" :total="page.total"></el-pagination>
        </div>
    </div>
</template>

<script>
export default {
  name: 'base-table',
  props: ['tableData', 'tableHead'],
  data () {
    return {
      selectedinfo: '',
      page: {total: 10, per_page: 10, cur_page: 1},
      currentPage: 1,
      pageSize: 10
    }
  },
  methods: {
    handleCurrentChange (val) {
      if (this.selectedinfo !== '') {
        this.currentPage = this.thisPage
        this.curPageVisible = true
      } else {
        this.thisPage = val
        this.page.cur_page = val
        var sqlString = `?page=${val}&delFlag=0`
        if (this.amCode !== '') {
          sqlString += `&amCode=${this.amCode}`
        }
        if (this.amName !== '') {
          sqlString += `&amName=${this.amName}`
        }
        if (this.anlsUrl !== '') {
          sqlString += `&anlsUrl=${this.anlsUrl}`
        }
        if (this.anlsClsName !== '') {
          sqlString += `&anlsClsName=${this.anlsClsName}`
        }
        this.$axios.get(`/dmatddct/api/v1/ddct/ddctAnlsModel${sqlString}`).then((res) => {
          if (res.data.code === '0') {
            this.tableData = res.data.data
            this.page.total = res.data.total
            this.page.per_page = res.data.per_page
          } else {
            this.$message({message: res.data.msg, type: 'error'})
          }
        })
      }
    },
    selectedTableData (selected) {
      this.selectedinfo = selected
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style scoped>

</style>

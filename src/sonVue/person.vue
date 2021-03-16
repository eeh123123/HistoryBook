<template>
	<div class="sonVue">
		<el-input v-model="person" placeholder="请输入姓名"></el-input>
		<el-input v-model="father_F_MC"  placeholder="请选择父亲姓名" suffix-icon="el-icon-circle-plus" @click.native="open_Dialog()">
		</el-input>
		<el-button type="primary" icon="el-icon-search" @click="searchs">搜索</el-button>
		<el-dialog :title="Dialog.title" :visible.sync="Dialog.Visible" :close-on-click-modal="false" v-dialogDrag width="30%">
			<el-input placeholder="请输入内容" v-model="Dialog.search_data" class="input-with-select">
				<el-button slot="append" icon="el-icon-search" @click="Dialog_query()"></el-button>
			</el-input>
			<el-table tooltip-effect="light" :data.sync="Dialog.tableData.data" @current-change='Dialog_selectedTableData' @row-dblclick="Dialog_save" highlight-current-row>
				<el-table-column v-for="(item, index) in Dialog.tableHead" :value="item.code" :key="index" :show-overflow-tooltip="true" :prop="item.code" :label="item.label" align='center'></el-table-column>
			</el-table>
			<el-pagination @current-change="Dialog_HandleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="10" layout="total,prev, pager, next" :total="Dialog.tableData.total" :current-page.sync="Dialog.currentPage">
			</el-pagination>
			<!-- 按钮区 -->
			<span slot="footer">
            <el-button type="success" icon="el-icon-check" @click="Dialog_save">保存</el-button>
            <el-button type="danger"  icon="el-icon-close" @click="Dialog_close">关闭</el-button>
        </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				person: '',
				fatherid: '',
				father_F_MC:'',
				Dialog: {
					code: '',
					Visible: false,
					title: '',
					search_data: '',
					tableData: [],
					tableHead: [],
					currentPage: 1,
					commonData: {}, //存查询条件
					sqlwhere: "",
					currentRow: null,
				}
			}
		},
		methods: {
			open_Dialog() {
				this.Dialog.code = "fatherid"
				this.Dialog.commonData = {
					F_Caption: "person_name",
					F_Caption_Name: "名字",
					F_Pkey: "id",
					F_Pkey_Name: "编号",
					tablename: "person",
				}
				this.Dialog_query()
				this.Dialog.search_data = "";
				this.Dialog.Visible = true
			},
			Dialog_query() {
				if(this.Dialog.search_data != "") {
					this.Dialog.sqlwhere = " AND " + this.Dialog.commonData.F_Caption + " LIKE '%" + this.Dialog.search_data + "%'"
				} else {
					this.Dialog.sqlwhere = ""
				}
				this.Dialog.currentPage = 1
				this.Dialog_queryData(this.Dialog.commonData)
			},
			Dialog_queryData(data) {
				axios.get(this.$store.state.MYURL + "QueryTableRow.do", {
					params: {
						tablename: data.tablename,
						showcol: [data.F_Pkey, data.F_Caption],
						sqlwhere: "1=1 " + this.Dialog.sqlwhere + " Limit " + (this.Dialog.currentPage - 1) * 10 + ",10"
					}
				}).then(res => {
					this.Dialog.tableHead = [{
							code: data.F_Pkey,
							label: data.F_Pkey_Name
						},
						{
							code: data.F_Caption,
							label: data.F_Caption_Name,
						}
					]
					this.Dialog.tableData = res.data
				})
			},
			Dialog_save() {
				this.fatherid = this.Dialog.currentRow[this.Dialog.commonData.F_Pkey]
				this.father_F_MC = this.Dialog.currentRow[this.Dialog.commonData.F_Caption]
				this.Dialog.Visible = false
				this.Dialog.search_data = ''
				this.searchs()
			},
			Dialog_selectedTableData(val) {
				this.Dialog.currentRow = val;
			},
			Dialog_HandleCurrentChange() {
				this.Dialog_queryData(this.Dialog.commonData)
			},
			Dialog_close() {
				this.Dialog.Visible = false
				this.Dialog.search_data = ''
			},
			searchs() {
				this.$parent.option = " WHERE 1 = 1 "
				if(this.person) {
					this.$parent.currentPage = 1
					this.$parent.option += " AND A.person_name like '%" + this.person + "%'"
				}
				else if(this.fatherid) {
					this.$parent.currentPage = 1
					this.$parent.option += " AND  A.fatherid = '" + this.fatherid + "'"
				}
				this.$parent.searchFlag = true
				this.$parent.queryTableData()
			},
		}
	}
</script>

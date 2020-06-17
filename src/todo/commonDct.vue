<template>
	<div class="commonDct" ref="getHeight">
		<div class="floor1">
			<el-button type="primary" icon="el-icon-search" @click="addNewRow">新增</el-button>
			<el-button type="primary" icon="el-icon-search" @click="save">保存</el-button>
			<component v-bind:is="currentView"></component>
		</div>
		<div class="floor2">
			<BaseTable pageSize="15" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange" 
				@sortBy="queryTableData"
				@selectedTableData="Left1_selectedTableData" :callBack="cbFunc" :page="page" :tableHead="tableHead" :tableData.sync="tableData" :tableHeight="tableData.tableHeight"></BaseTable>
		</div>
	</div>
</template>

<script>
	import person from '../sonVue/person.vue'
	import attribute from '../sonVue/attribute.vue'
	import attributeTime from '../sonVue/attributeTime.vue'
	import guanzhi from '../sonVue/guanzhi.vue'
	import stone from '../sonVue/stone.vue'
	import BaseTable from '../tools/BaseTable.vue'
	let vm;
	export default {
		components: {
			BaseTable
		},
		computed: {
			currentView() {
				if(this.$route.query.dctid=="person")
				{
					return person
				}
				if(this.$route.query.dctid=="attribute")
				{
					return attribute
				}
				if(this.$route.query.dctid=="attributeTime")
				{
					return attributeTime
				}
				if(this.$route.query.dctid=="guanzhi")
				{
					return guanzhi
				}
				if(this.$route.query.dctid=="stone")
				{
					return stone
				}
			}
		},
		data() {
			return {
				tableData: {
					data: [],
					total: 0,
					map: new Map(),
					tableHeight: 300
				},
				Orign_Data: [],
				cbFunc: function() {},
				tableHead: [{
					code: "DCT_ID",
					label: "名称"
				}, {
					code: "DCT_CAPTION",
					label: "编号"
				}],
				currentPage: 1,
				index: 0,
				arr: [
					person,
				],
				page: {
					pageSize: 10
				},
				option:'',
				searchFlag:true
			}
		},
		mounted() {
			vm = this;
			this.setTableHeight()
			this.queryTableHead()
		},
		methods: {
			setTableHeight() {
				let obj = this.$refs.getHeight
				let height = obj.offsetHeight - 52 - 32
				setTimeout(() => {
					this.tableData.tableHeight = height
					this.queryTableData()
				}, 50)
			},
			handleCurrentChange(val) {
				vm.currentPage = val
				vm.queryTableData()
			},
			handleSizeChange() {

			},
			Left1_selectedTableData(val) {

			},
			queryTableHead() {
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
					params: {
						tablename: "DOF_DCT_COLS",
						showcol: ['*'],
						sqlwhere: "DCT_ID = '" + this.$route.query.dctid + "' AND COL_VISIBLE ='1' ORDER BY COL_DISP_ORDER"
					}
				}).then(res => {
					let tableHead = []
					for(let i = 0; i < res.data.data.length; i++) {
						if(res.data.data[i].COL_APP_TYPE == "window") {
							this.tableData.map.set(res.data.data[i].COL_ID, {})
							this.getF_Pkey_F_Caption(res.data.data[i].COL_ID, res.data.data[i].COL_FK_DCT)
							this.getF_Pkey_Name_F_Caption_Name(res.data.data[i].COL_ID, res.data.data[i].COL_FK_DCT)
						}
						tableHead.push({
							code: res.data.data[i].COL_ID,
							label: res.data.data[i].COL_TITLE,
							COL_APP_TYPE: res.data.data[i].COL_APP_TYPE,
							COL_ENUM_KEY:res.data.data[i].COL_ENUM_KEY,
							COL_SHOW_SIZE:res.data.data[i].COL_SHOW_SIZE,
							COL_SORTABLE:res.data.data[i].COL_SORTABLE,
							ENUM_LIST:[]
						})
					}
					let dct_enums_Array = JSON.parse(localStorage.getItem("dct_enums"))
					for(let i =0;i<tableHead.length;i++){
						for(let j=0;j<dct_enums_Array.length;j++){
							if(tableHead[i].COL_ENUM_KEY==dct_enums_Array[j].F_T3 ){
								tableHead[i].ENUM_LIST.push({label:dct_enums_Array[j].F_MC,value:dct_enums_Array[j].id})
							}
						}
					}
					
					
					this.tableHead = tableHead
				})
			},
			queryTableData(column) {
				let params = {
					tablename: this.$route.query.dctid,
					pageSqlwhere: " Limit " + (this.currentPage - 1) * 15 + ",15",
					searchFlag:this.searchFlag
				}
				if(this.$route.query.page == 0) {
					params.pageSqlwhere = ""
				}
				if(this.option){
					params.sqlwhere = this.option ||"" + params.sqlwhere
				}
				if(column){
					if(column.order=="descending"){
						params.sortBy = " ORDER BY convert("+column.prop+" using gbk) asc "
					}					
					else if(column.order=="ascending"){
						params.sortBy = " ORDER BY convert("+column.prop+" using gbk) desc "
					}
				}
				axios.get(this.$store.state.MYURL + 'QueryDct.do', {
					params: params
				}).then(res => {
					this.tableData.data = res.data.data || []
					if(this.$route.query.page == 0) {
						this.page.pageSize = res.data.data.length
					}
					this.tableData.total = res.data.total || 0
					this.Orign_Data = JSON.parse(JSON.stringify(res.data.data));
				})
			},
			getF_Pkey_F_Caption(colId, dctid) {
				axios.get(this.$store.state.MYURL + "QueryTableRow.do", {
					params: {
						tablename: "DCT_DICTS",
						showcol: ['*'],
						sqlwhere: "DCT_ID = '" + dctid + "'"
					}
				}).then(res => {
					this.tableData.map.set(colId, {
						F_Pkey: res.data.data[0].DCT_FID,
						F_Caption: res.data.data[0].DCT_FNAME,
						F_Pkey_Name: '',
						F_Caption_Name: '',
						tablename: dctid
					})
				})
			},
			getF_Pkey_Name_F_Caption_Name(colId, dctid) {
				axios.get(this.$store.state.MYURL + "QueryTableRow.do", {
					params: {
						tablename: "DOF_DCT_COLS",
						showcol: ['*'],
						sqlwhere: "DCT_ID = '" + dctid + "'"
					}
				}).then(res => {
					for(let i in this.tableData.map.get(colId)) {
						for(let j = 0; j < res.data.data.length; j++) {
							if(res.data.data[j].COL_ID == this.tableData.map.get(colId)[i]) {
								if(this.tableData.map.get(colId).F_Pkey == res.data.data[j].COL_ID) {
									this.tableData.map.get(colId).F_Pkey_Name = res.data.data[j].COL_CAPTION
								} else if(this.tableData.map.get(colId).F_Caption == res.data.data[j].COL_ID) {
									this.tableData.map.get(colId).F_Caption_Name = res.data.data[j].COL_CAPTION
								}
							}
						}
					}
				})
			},
			addNewRow() {
				vm.tableData.data.push({
					isInsert: true,
				});
			},
			save() {
				var p = Promise.all([new Promise(function(resolve, reject) {
					vm.insertAxios(resolve)

				}), new Promise(function(resolve, reject) {
					vm.updateAxios(resolve)
				})])
				p.then(function(datas) {
					vm.$message({
						type: 'success',
						message: datas
					});
					vm.Orign_Data = JSON.parse(JSON.stringify(vm.tableData.data))
				});
			},
			insertAxios(resolve) {
				let insertData = JSON.parse(JSON.stringify(this.tableData.data))

				for(let i = 0; i < insertData.length; i++) {
					for(let j in insertData[i]) {
						if(j.indexOf("_F_BH") != -1) {
							delete insertData[i][j]
						}
						if(j.indexOf("_F_MC") != -1) {
							delete insertData[i][j]
						}
					}
				}
				let insertData_Request = this.$tools.getInsert(this.Orign_Data, insertData, 'isInsert')
				if(insertData_Request.array_insert_str.length != 0) {
					axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
							params: {
								tablename: this.$route.query.dctid,
								values: insertData_Request.array_insert_str,
								Insertcol: insertData_Request.Insertcol,
							}
						})
						.then(res => {
							for(let i = 0; i < this.tableData.data.length; i++) {
								this.tableData.data[i].isInsert = false
							}
							resolve(res.data.msg)
						})
				} else {
					resolve("无新增")
				}
			},
			updateAxios(resolve) {
				let updateData = this.$tools.ComparArray(this.Orign_Data, this.tableData.data, 'id')
				for(let i = 0; i < updateData.length; i++) {
					for(let j in updateData[i]) {
						if(j.indexOf("_F_BH") != -1) {
							delete updateData[i][j]
						}
						if(j.indexOf("_F_MC") != -1) {
							delete updateData[i][j]
						}
					}
				}
				if(updateData.length != 0) {
					axios.post(this.$store.state.MYURL + 'UpdateTableRow.do', {
							params: {
								tablename: this.$route.query.dctid,
								values: updateData,
							}
						})
						.then(res => {
							resolve(res.data.msg)
						})
				} else {
					resolve("无更新")
				}
			}
		}

	}
</script>

<style lang="less">
	.commonDct {
		width: 100%;
		height: 100%;
		.floor1 {
			width: 100%;
			padding: 10px 10px 0 10px;
		}
		.floor2 {
			width: 100%;
			.baseTable {
				border: none;
				td .el-input__inner {
					border: none;
				}
				.el-table__body-wrapper {
					height: calc(100% - 40px) !important;
				}
			}
		}
	}
</style>
<template>
	<div class="commonDct">
		<div class="floor1">
			<el-button type="primary" icon="el-icon-search" @click="addNewRow">新增</el-button>
			<el-button type="primary" icon="el-icon-search" @click="save">保存</el-button>
		</div>
		<div class="floor2">
			<BaseTable pageSize="15" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange" @selectedTableData="Left1_selectedTableData" :callBack="cbFunc" :tableHead="tableHead" :tableData.sync="tableData"></BaseTable>
		</div>
	</div>
</template>

<script>
	import BaseTable from '../tools/BaseTable.vue'
	let vm;
	export default {
		components: {
			BaseTable
		},
		data() {
			return {
				tableData: {
					data: [],
					total: 0,
					map: new Map(),
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
				saveMsg: '',
			}
		},
		mounted() {
			vm = this;
			vm.queryTableHead()
			vm.queryTableData()
		},
		methods: {
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
							label: res.data.data[i].COL_CAPTION,
							COL_APP_TYPE: res.data.data[i].COL_APP_TYPE,
						})
					}
					this.tableHead = tableHead
				})
			},
			queryTableData() {
				axios.get(this.$store.state.MYURL + 'QueryDct.do', {
					params: {
						tablename: this.$route.query.dctid,
						sqlwhere: " Limit " + (this.currentPage - 1) * 15 + ",15"
					}
				}).then(res => {
					this.tableData.data = res.data.data || []
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
						F_Caption: res.data.data[0].DCT_F_NAME,
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
					})

				])
				p.then(function(datas) {
					vm.$message({
						type: 'success',
						message: datas
					});
				});
			},
			insertAxios(resolve) {
				let insertData = this.$tools.getInsert(this.Orign_Data, this.tableData.data, 'isInsert')
				if(insertData.array_insert_str.length != 0) {
					axios.post(this.$store.state.MYURL + 'InsertTableRow.do', {
							params: {
								tablename: this.$route.query.dctid,
								values: insertData.array_insert_str,
								Insertcol: insertData.Insertcol,
							}
						})
						.then(res => {
							for(let i = 0; i < this.tableData.data.length; i++) {
								this.tableData.data[i].isInsert = false
							}
							resolve(res.data.msg)
						})
				}
			},
			updateAxios(resolve) {
				let updateData = this.$tools.ComparArray(this.Orign_Data, this.tableData.data, 'id')
				axios.post(this.$store.state.MYURL + 'UpdateTableRow.do', {
						params: {
							tablename: this.$route.query.dctid,
							values: updateData,
						}
					})
					.then(res => {
						resolve(res.data.msg)
					})
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
			height: 52px;
			padding: 10px;
		}
		.floor2 {
			width: 100%;
			height: 90%;
			.baseTable {
				border: none;
				color: #224491;
				td .el-input__inner {
					border: none;
				}
			}
		}
	}
</style>
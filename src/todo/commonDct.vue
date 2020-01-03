<template>
	<div class="commonDct">
		<div class="floor1">
			<el-button type="primary" icon="el-icon-search" @click="addNewRow">新增</el-button>
			<el-button type="primary" icon="el-icon-search" @click="addNewRow">保存</el-button>
		</div>
		<div class="floor2">
			<BaseTable pageSize="20" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange" @selectedTableData="Left1_selectedTableData" :callBack="cbFunc" :tableHead="tableHead" :tableData.sync="tableData"></BaseTable>
		</div>
	</div>
</template>

<script>import BaseTable from '../tools/BaseTable.vue'
let vm;
export default {
	components: {
		BaseTable
	},
	data() {
		return {
			tableData: {
				data: [],
				total: 0
			},
			cbFunc: function() {},
			contentType: 1,
			dctName: '',
			tableHead: [{
				code: "DCT_ID",
				label: "名称"
			}, {
				code: "DCT_CAPTION",
				label: "编号"
			}], //左侧列表1
			LeftData1: {},
			RightHead: [{
				code: 'COL_ID',
				label: '标识',
				type: 'text',
			}],
			currentPage: 1
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
		queryTableHead() {
			axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
					params: {
						tablename: "DOF_DCT_COLS",
						showcol: ['*'],
						sqlwhere: "DCT_ID = '" + this.$route.query.dctid + "' AND COL_VISIBLE ='1' ORDER BY COL_DISP_ORDER"
					}
				}).then(function(response) {
					let tableHead = []
					for(let i = 0; i < response.data.data.length; i++) {
						tableHead.push({
							code: response.data.data[i].COL_ID,
							label: response.data.data[i].COL_CAPTION,
							COL_APP_TYPE: response.data.data[i].COL_APP_TYPE
						})
					}
					vm.tableHead = tableHead
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		queryTableData() {
			axios.get(this.$store.state.MYURL + 'QueryDct.do', {
					params: {
						tablename: this.$route.query.dctid,
						sqlwhere:" Limit " + (vm.currentPage - 1) * 20 + ",20"
					}
				}).then(function(response) {
					vm.tableData = {
						data: response.data.data || [],
						total: response.data.total || 0
					}
				})
				.catch(function(error) {
					console.log(error);
				});
		},
		Left1_selectedTableData(val) {},
		addNewRow() {
			vm.tableData.data.push({
				isInsert: true,
			});
		},
		save() {

		}
	},
	watch: {
		contentType() {

		},
	},

}</script>

<style lang="less">.commonDct {
	width: 100%;
	height: 100%;
	/*蓝色背景部分结束*/
	.floor1 {
		width: 100%;
		height: 52px;
		padding: 10px;
	}
	.floor2 {
		width: 100%;
		height: 90%;
		.son1 {
			float: left;
			width: 30%;
			height: 100%;
			box-sizing: border-box;
			padding: 1px;
			border-radius: 10px;
			.box {
				border-radius: 10px;
				box-sizing: border-box;
				height: 100%;
				width: 100%;
				position: relative;
				.LeftList {
					text-align: center;
					margin-top: 10px;
					height: calc(100% - 52px);
					width: 100%;
				}
			}
			.box:before {
				content: "";
				width: 25px;
				height: 15px;
				display: block;
				position: absolute;
				top: -3px;
				left: -2px;
				border-top: 3px solid #74bfff;
				border-left: 3px solid #74bfff;
			}
			.box:after {
				content: "";
				width: 25px;
				height: 15px;
				display: block;
				position: absolute;
				top: -3px;
				right: -2px;
				border-top: 3px solid #74bfff;
				border-right: 3px solid #74bfff;
			}
			.box .border {
				height: 12px;
				width: 100%;
				position: absolute;
				bottom: 0;
				margin: 0;
			}
			.box .border:before {
				content: "";
				width: 25px;
				height: 15px;
				display: block;
				position: absolute;
				top: -3px;
				left: -2px;
				border-bottom: 3px solid #74bfff;
				border-left: 3px solid #74bfff;
			}
			.box .border:after {
				content: "";
				width: 25px;
				height: 15px;
				display: block;
				position: absolute;
				top: -3px;
				right: -2px;
				border-bottom: 3px solid #74bfff;
				border-right: 3px solid #74bfff;
			}
		}
		.baseTable {
			border: none;
			color: #224491;
			.el-input__inner {
				border: none;
			}
		}
	}
}</style>

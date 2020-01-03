<template>
	<div class="Dct">
		<div class="floor1">
		</div>
		<div class="floor2">
			<div class="son1">
				<div class="box">
					<el-button type="primary" @click="contentType=1" class="margin-left10 margin-top10">列表</el-button>
					<el-button type="primary" @click="contentType=2" class="margin-left10 margin-top10">字典</el-button>
					<el-button type="primary" @click="contentType=3" class="margin-left10 margin-top10">字段</el-button>
					<div class="border"></div>
					<div v-if="contentType==1" class="LeftList">
						<el-input v-model="dctName" placeholder="字典名" style="width:80%"></el-input>
						<BaseTable ref="left_List" :visible="true" :title="'字典列表'" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange" @selectedTableData="Left1_selectedTableData" :callBack="cbFunc" :tableHead="LeftHead1" :tableData.sync="LeftData1"></BaseTable>
					</div>
					<div v-if="contentType==2" class="LeftList"></div>
					<div v-if="contentType==3" class="LeftList"></div>
				</div>
			</div>
			<div class="son2">
				<div class="son2-btn">
					<el-button type="primary" @click="addRow()" class="margin-left10">新增</el-button>
					<el-button type="primary" @click="save()" class="margin-left10">保存</el-button>
				</div>
				<BaseTable ref="left_List" :visible="true" :title="'字典列表'" :handleCurrentChange="handleCurrentChange" :handleSizeChange="handleSizeChange" @selectedTableData="Left1_selectedTableData" :callBack="cbFunc" :tableHead="RightHead" :tableData.sync="RightData"></BaseTable>
			</div>
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
				tableData: [],
				cbFunc: function() {},
				contentType: 1,
				dctName: '',
				LeftHead1: [{
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
				}, {
					code: 'COL_CAPTION',
					label: '标题',
					type: 'text',
				}, {
					code: 'COL_TITLE',
					label: '描述',
					type: 'text',
				}, {
					code: 'COL_APP_TYPE',
					label: '字段类型',
					type: 'select',
				},{
					code: 'COL_EDITABLE',
					label: '可否编辑',
					type: 'Boolean',
				},  {
					code: 'COL_ELEMENT_TYPE_MODE',
					label: '引用元素否',
					type: 'Boolean',
				}, {
					code: 'COL_ELEMENT_TYPE_FMC',
					label: '元素类型',
					type: 'window',
				}, {
					code: 'COL_FK_DCT',
					label: '引用否',
					type: 'Boolean',
				}, {
					code: 'COL_FK_DCT_FMC',
					label: '引用字典',
					type: 'text',
				}, {
					code: 'COL_ENUM',
					label: '枚举否',
					type: 'text',
				}, {
					code: 'COL_ENUM_KEY',
					label: '枚举类型',
					type: 'text',
				}, {
					code: 'COL_US',
					label: '启用',
					type: 'text',
				}, {
					code: 'COL_FK_ACCESS',
					label: '权限过滤',
					type: 'text',
				}, {
					code: 'COL_VISIBLE',
					label: '可见否',
					type: 'text',
				}, {
					code: 'COL_NULL',
					label: '空否',
					type: 'text',
				}, {
					code: 'COL_VT_REF',
					label: '参照',
					type: 'text',
				}, {
					code: 'COL_VT_REF_COL',
					label: '参照列',
					type: 'text',
				}, {
					code: 'COL_VT_REF_ATTR',
					label: '参照属性',
					type: 'text',
				}, {
					code: 'COL_WEBPARAM',
					label: '前端扩展参数',
					type: 'text',
				}],
				RightData: {
					data: [],
					total: 1
				}
			}
		},
		mounted() {
			vm = this;
			vm.queryLeftList();
		},
		methods: {
			handleCurrentChange() {},
			handleSizeChange() {

			},
			queryLeftList() {
				let option = {
					showcol: ["*"],
					sqlwhere: "1 = 1"
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: "DCT_DICTS",
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(function(response) {
						vm.LeftData1 = response.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			QueryRightData() {
				// 标识COL_ID、标题COL_CAPTION、描述COL_TITLE、业务类型COL_APP_TYPE、引用元素否COL_ELEMENT_TYPE_MODE、元素类型COL_ELEMENT_TYPE_FMC、引用否COL_FK_DCT
				//、引用字典COL_FK_DCT_FMC、枚举否COL_ENUM、枚举类型COL_ENUM_KEY、启用COL_US、权限过滤COL_FK_ACCESS、可见否COL_VISIBLE、国际化COL_INTER、空否COL_NULL、
				//虚拟COL_VT、参照COL_VT_REF、参照列_COL_VT_REF_COL、参照属性COL_VT_REF_ATTR、前端扩展参数COL_WEBPARAM
				let option = {
					showcol: ["*"],
					sqlwhere: "1 = 1"
				}
				axios.get(this.$store.state.MYURL + 'QueryTableRow.do', {
						params: {
							tablename: "DCT_DICTS",
							showcol: option.showcol.join(","),
							sqlwhere: option.sqlwhere
						}
					})
					.then(function(response) {
						vm.LeftData1 = response.data;
					})
					.catch(function(error) {
						console.log(error);
					});
			},
			Left1_selectedTableData(val) {
				val.DCT_ID
			},
			addRow() {
				vm.RightData.data.push({
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

	}
</script>

<style lang="less">
	.Dct {
		width: 100%;
		height: 100%;
		/*蓝色背景部分*/
		.el-input__inner,
		.el-textarea__inner {
			border: 1px solid #224491;
			color: #3bb4eb;
		}
		/*蓝色背景部分结束*/
		.floor1 {
			width: 100%;
			height: 10%;
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
			.son2 {
				float: left;
				width: 70%;
				height: 10px;
				.son2-btn {
					height: 40px;
					width: 100%;
					margin-bottom: 10px;
				}
			}
		}
	}
</style>
